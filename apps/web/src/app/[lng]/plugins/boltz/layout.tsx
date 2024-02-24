'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { rootstock } from 'wagmi/chains';

const wagConfig = getDefaultConfig({
  appName: 'Boltz Module',
  projectId: 'bb019c86931b565720306984e798ffb9',
  chains: [rootstock],
  ssr: true,
});

const client = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagConfig}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
