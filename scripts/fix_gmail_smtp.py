"""Point VPS SMTP at Google Workspace and probe send."""

from __future__ import annotations

import os
import shlex
import sys
import tempfile
from pathlib import Path

import paramiko

host = os.environ.get("ZERMAE_VPS_HOST", "132.148.73.92")
user = (os.environ.get("ZERMAE_SSH_USER") or "greentech").strip()
password = (os.environ.get("ZERMAE_SSH_PASS") or "").strip()
smtp_pass = (os.environ.get("ZERMAE_SMTP_PASS") or "").strip()
if not password:
    raise SystemExit("Set ZERMAE_SSH_PASS")
if not smtp_pass:
    raise SystemExit("Set ZERMAE_SMTP_PASS to the Google Workspace App Password for info@zermae.com")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=user, password=password, timeout=30, allow_agent=False, look_for_keys=False)


def sudo(cmd: str, timeout: int = 180) -> str:
    remote = f"printf '%s\\n' {shlex.quote(password)} | sudo -S -p '' -- {cmd}"
    _i, out, err = client.exec_command(remote, timeout=timeout)
    text = out.read().decode("utf-8", errors="replace")
    e = err.read().decode("utf-8", errors="replace")
    code = out.channel.recv_exit_status()
    cleaned = "\n".join(l for l in e.splitlines() if "password" not in l.lower())
    if cleaned.strip():
        print(cleaned, file=sys.stderr)
    if code != 0:
        raise SystemExit(f"failed ({code}): {cmd}\n{e}")
    return text


raw = sudo("bash -lc 'cat /var/www/zermae/Backend/.env'")
updates = {
    "SUPPORT_EMAIL": "info@zermae.com",
    "EMAIL_FROM": '"Zermae <info@zermae.com>"',
    "SMTP_HOST": "smtp.gmail.com",
    "SMTP_PORT": "587",
    "SMTP_SECURE": "false",
    "SMTP_USER": "info@zermae.com",
    "SMTP_PASS": smtp_pass,
}
seen: set[str] = set()
new_lines: list[str] = []
for line in raw.splitlines():
    if not line or line.lstrip().startswith("#") or "=" not in line:
        new_lines.append(line)
        continue
    k = line.split("=", 1)[0].strip()
    if k in updates:
        new_lines.append(f"{k}={updates[k]}")
        seen.add(k)
    else:
        new_lines.append(line)
for k, v in updates.items():
    if k not in seen:
        new_lines.append(f"{k}={v}")

local = Path(tempfile.gettempdir()) / "zermae-gmail-smtp.env"
local.write_text("\n".join(new_lines) + "\n", encoding="utf-8", newline="\n")
remote_tmp = f"/home/{user}/zermae-gmail-smtp.env"
sftp = client.open_sftp()
sftp.put(str(local), remote_tmp)

probe_js = """\
const fs = require('fs');
const path = require('path');
const nodemailer = require(path.join('/var/www/zermae/Backend/node_modules/nodemailer'));
const env = Object.fromEntries(
  fs.readFileSync('/var/www/zermae/Backend/.env','utf8').split(/\\r?\\n/)
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const i = l.indexOf('=');
      let v = l.slice(i+1);
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1,-1);
      return [l.slice(0,i), v];
    })
);
(async () => {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 587),
    secure: String(env.SMTP_SECURE).toLowerCase() === 'true',
    requireTLS: String(env.SMTP_SECURE).toLowerCase() !== 'true',
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  try {
    await transporter.verify();
    console.log('VERIFY_OK');
  } catch (e) {
    console.log('VERIFY_FAIL', e.message || String(e));
    process.exitCode = 2;
    return;
  }
  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM || env.SMTP_USER,
      to: env.SUPPORT_EMAIL || env.SMTP_USER,
      subject: 'Zermae Google Workspace SMTP OK',
      text: 'Google Workspace SMTP probe ' + new Date().toISOString(),
    });
    console.log('SEND_OK', info.messageId);
  } catch (e) {
    console.log('SEND_FAIL', e.message || String(e));
    process.exitCode = 3;
  }
})();
"""
with sftp.file("/tmp/zermae_gmail_probe.js", "w") as f:
    f.write(probe_js)
sftp.close()

sudo(
    "bash -lc "
    + shlex.quote(
        f"install -o zermae -g zermae -m 600 {remote_tmp} /var/www/zermae/Backend/.env && rm -f {remote_tmp}"
    )
)
print("=== CONFIG ===")
print(
    sudo(
        "bash -lc "
        + shlex.quote(
            "grep -E '^(SMTP_HOST|SMTP_PORT|SMTP_SECURE|SMTP_USER|SUPPORT_EMAIL|EMAIL_FROM)=' /var/www/zermae/Backend/.env; "
            "grep -q '^SMTP_PASS=.' /var/www/zermae/Backend/.env && echo SMTP_PASS=set || echo SMTP_PASS=missing"
        )
    )
)
print("=== PROBE ===")
print(
    sudo(
        "bash -lc "
        + shlex.quote(
            "runuser -u zermae -- /home/zermae/.nvm/versions/node/v20.19.0/bin/node /tmp/zermae_gmail_probe.js; "
            "rm -f /tmp/zermae_gmail_probe.js"
        )
    )
)
sudo("systemctl restart zermae-api")
print("API", sudo("systemctl is-active zermae-api").strip())
client.close()
