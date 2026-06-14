import { MobileShell } from "@/app/components/app/MobileShell";
import { WalletProviders } from "@/app/providers";

export default function AppRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProviders>
      <MobileShell>{children}</MobileShell>
    </WalletProviders>
  );
}
