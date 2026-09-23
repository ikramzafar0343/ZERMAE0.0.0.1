import { Logo } from "@/components/ui/logo";
import { brandName } from "@/constants/brand";

export function MaintenanceSplash({ message }: { message: string }) {
  return (
    <div className="maintenance-splash">
      <div className="maintenance-splash-inner">
        <Logo theme="dark" size="auth" linked={false} className="maintenance-splash-logo" />
        <p className="maintenance-splash-eyebrow">{brandName}</p>
        <h1 className="maintenance-splash-title">{message.trim() || "Coming Soon"}</h1>
      </div>
    </div>
  );
}
