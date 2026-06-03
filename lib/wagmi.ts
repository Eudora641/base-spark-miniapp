import { QueryClient } from '@tanstack/react-query';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { createConfig, http } from 'wagmi';

export const APP_NAME = 'Base Spark';

export const ATTRIBUTION_DATA_SUFFIX =
  '0x' as `0x${string}`;

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: APP_NAME,
      version: '4',
      preference: 'all',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

export const queryClient = new QueryClient();
