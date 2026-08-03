import { createConfig, http } from 'wagmi';
import { mainnet, bsc, base, arbitrum, polygon, avalanche, optimism } from 'wagmi/chains';
import { injectedConnector } from './connectors/injected';
import { walletConnectConnector } from './connectors/walletconnect';

// Solana and Tron are handled by dedicated wallet SDKs (e.g. @solana/wallet-adapter,
// TronLink) since they fall outside EVM/wagmi — kept out of this config on purpose.
//
// Connectors are hand-written in `./connectors/*` instead of imported from
// `wagmi/connectors`. That package bundles every connector (injected,
// WalletConnect, AND Coinbase Wallet) in one module, and recent
// `@coinbase/wallet-sdk` releases pull in `@coinbase/cdp-sdk` for Smart
// Wallet / x402 agentic-payments support, which references an unresolvable
// `@x402/evm/upto/client` subpath and breaks the build. Because it's one
// barrel file, even importing just `injected` from it drags the broken
// module into the build. This app has zero dependency on `@coinbase/*` or
// `@x402/*`, directly or transitively — see ./connectors/injected.ts and
// ./connectors/walletconnect.ts.
const chains = [mainnet, bsc, base, arbitrum, polygon, avalanche, optimism] as const;
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    injectedConnector(),
    ...(projectId ? [walletConnectConnector({ projectId, chains })] : []),
  ],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [avalanche.id]: http(),
    [optimism.id]: http(),
  },
  ssr: true,
});
