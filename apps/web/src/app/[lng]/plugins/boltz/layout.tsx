import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boltz - LaWallet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
