import type { Chain } from '@/types';

export interface ChainMeta {
  id: Chain;
  label: string;
  shortLabel: string;
  colorVar: string; // css var suffix, keeps chain chips on-brand instead of raw brand colors
  explorerUrl: (address: string) => string;
  addressPattern: RegExp;
}

/**
 * Adding a new chain is a one-line addition here — every search filter,
 * wallet chip, and explorer link derives from this registry so nothing
 * else in the app needs to change.
 */
export const CHAINS: Record<Chain, ChainMeta> = {
  ETHEREUM: {
    id: 'ETHEREUM',
    label: 'Ethereum',
    shortLabel: 'ETH',
    colorVar: 'chain-eth',
    explorerUrl: (a) => `https://etherscan.io/address/${a}`,
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  BNB_CHAIN: {
    id: 'BNB_CHAIN',
    label: 'BNB Chain',
    shortLabel: 'BNB',
    colorVar: 'chain-bnb',
    explorerUrl: (a) => `https://bscscan.com/address/${a}`,
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  SOLANA: {
    id: 'SOLANA',
    label: 'Solana',
    shortLabel: 'SOL',
    colorVar: 'chain-sol',
    explorerUrl: (a) => `https://solscan.io/account/${a}`,
    addressPattern: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  },
  BASE: {
    id: 'BASE',
    label: 'Base',
    shortLabel: 'BASE',
    colorVar: 'chain-base',
    explorerUrl: (a) => `https://basescan.org/address/${a}`,
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  ARBITRUM: {
    id: 'ARBITRUM',
    label: 'Arbitrum',
    shortLabel: 'ARB',
    colorVar: 'chain-arb',
    explorerUrl: (a) => `https://arbiscan.io/address/${a}`,
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  POLYGON: {
    id: 'POLYGON',
    label: 'Polygon',
    shortLabel: 'MATIC',
    colorVar: 'chain-poly',
    explorerUrl: (a) => `https://polygonscan.com/address/${a}`,
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  AVALANCHE: {
    id: 'AVALANCHE',
    label: 'Avalanche',
    shortLabel: 'AVAX',
    colorVar: 'chain-avax',
    explorerUrl: (a) => `https://snowtrace.io/address/${a}`,
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  OPTIMISM: {
    id: 'OPTIMISM',
    label: 'Optimism',
    shortLabel: 'OP',
    colorVar: 'chain-op',
    explorerUrl: (a) => `https://optimistic.etherscan.io/address/${a}`,
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
  },
  TRON: {
    id: 'TRON',
    label: 'Tron',
    shortLabel: 'TRX',
    colorVar: 'chain-tron',
    explorerUrl: (a) => `https://tronscan.org/#/address/${a}`,
    addressPattern: /^T[a-zA-Z0-9]{33}$/,
  },
};

export const CHAIN_LIST = Object.values(CHAINS);

/** Best-effort chain detection from raw address shape, used to pre-select a filter. */
export function detectLikelyChains(address: string): Chain[] {
  return CHAIN_LIST.filter((c) => c.addressPattern.test(address.trim())).map((c) => c.id);
}
