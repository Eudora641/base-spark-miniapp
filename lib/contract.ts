import type { Address } from 'viem';

export const DEFAULT_SPARK_REWARD_CONTRACT =
  '0x7a28D52c770A0597B08B175dC853A82D4D610B68' as Address;

export const SPARK_REWARD_ABI = [
  {
    type: 'function',
    name: 'claimSpark',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'note', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'claimCount',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'SparkClaimed',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'note', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;

export const SPARK_REWARD_CONTRACT =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || DEFAULT_SPARK_REWARD_CONTRACT) as Address;

export const HAS_CONTRACT =
  /^0x[a-fA-F0-9]{40}$/.test(SPARK_REWARD_CONTRACT);
