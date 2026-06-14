import { MobileShell } from "@/app/components/app/MobileShell";
import { WalletProviders } from "@/app/providers";

export default function SplitRouteLayout({
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
