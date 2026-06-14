import { AppOrnaments } from "./AppOrnaments";
import { AppHeader } from "./AppHeader";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-stage">
      <AppOrnaments />
      <div className="mobile-frame">
        <AppHeader />
        <div className="mobile-content">
          <div className="mobile-content__inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
