/**
 * Smoke: admin login challenge + OTP verify + forgot-password resetPath (local SMTP-off).
 * Does not leave a permanent password change unless RESET_APPLY=1.
 */
import { createHash } from "node:crypto";

import { query } from "@/server/database/query";
import { authService } from "@/server/services/auth/auth.service";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMeAdmin123!";

  console.log("1_ADMIN_LOGIN_CHALLENGE");
  const { challengeId } = await authService.requestAdminLogin({ email, password });
  if (!challengeId) throw new Error("No challengeId");
  console.log("CHALLENGE_OK", challengeId.slice(0, 8));

  // Local: OTP is hashed in DB; set known OTP like QA helper when SMTP logs only.
  const otp = "4821";
  const hash = createHash("sha256").update(otp, "utf8").digest("hex");
  await query(
    `UPDATE account
     SET admin_login_otp_hash = $1,
         admin_login_otp_expires = NOW() + INTERVAL '10 minutes'
     WHERE admin_login_challenge_id = $2`,
    [hash, challengeId],
  );

  console.log("2_ADMIN_OTP_VERIFY");
  const verified = await authService.verifyAdminOtp({ challengeId, otp });
  if (!verified.sessionToken || verified.user.email !== email.toLowerCase()) {
    throw new Error("Verify failed");
  }
  console.log("OTP_OK", verified.user.role, verified.user.email);

  console.log("3_ADMIN_FORGOT_RESET_PATH");
  const forgot = await authService.requestPasswordReset(email, { forAdmin: true });
  if (!forgot.resetPath && process.env.NODE_ENV === "production") {
    console.log("FORGOT_OK_EMAIL_MODE (no resetPath when SMTP sends)");
  } else if (forgot.resetPath?.includes("token=") && forgot.resetPath.includes("context=admin")) {
    console.log("FORGOT_OK_LOCAL", forgot.resetPath.slice(0, 48) + "…");
  } else {
    throw new Error(`Unexpected forgot result: ${JSON.stringify(forgot)}`);
  }

  console.log("AUTH_SMOKE_PASS");
}

main().catch((error) => {
  console.error("AUTH_SMOKE_FAIL", error);
  process.exit(1);
});
