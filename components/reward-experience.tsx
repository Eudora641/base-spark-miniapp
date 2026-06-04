'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  ChevronRight,
  ExternalLink,
  FileText,
  Flame,
  Gift,
  PlugZap,
  RefreshCcw,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { base } from 'wagmi/chains';
import { HAS_CONTRACT, SPARK_REWARD_ABI, SPARK_REWARD_CONTRACT } from '@/lib/contract';
import { ATTRIBUTION_DATA_SUFFIX } from '@/lib/wagmi';

const DAILY_REWARD = 25;

function shortHash(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function baseScanUrl(path: string) {
  return `https://basescan.org/${path}`;
}

function connectorLabel(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('coinbase')) return 'Coinbase Wallet';
  if (lower.includes('injected')) return 'Browser Wallet';
  return name;
}

function claimDate() {
  return new Date().toISOString().slice(0, 10);
}

function storageKey(address: string, key: string) {
  return `base-spark:${address.toLowerCase()}:${key}`;
}

export function RewardExperience() {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('Connect a wallet, then confirm the onchain claim to unlock your reward.');
  const [hasClaimed, setHasClaimed] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>();

  const { address, chainId, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();
  const {
    data: onchainClaimCount,
    isLoading: isReadingClaims,
    refetch: refetchClaimCount,
  } = useReadContract({
    address: SPARK_REWARD_CONTRACT,
    abi: SPARK_REWARD_ABI,
    functionName: 'claimCount',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: HAS_CONTRACT && Boolean(address),
    },
  });
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    chainId: base.id,
    hash: lastTxHash,
    query: {
      enabled: Boolean(lastTxHash),
    },
  });

  useEffect(() => {
    if (!address) {
      setPoints(0);
      setStreak(0);
      setHasClaimed(false);
      setLastTxHash(undefined);
      setMessage('Connect a wallet, then confirm the onchain claim to unlock your reward.');
      return;
    }

    const today = claimDate();
    const savedPoints = Number(window.localStorage.getItem(storageKey(address, 'points')) || 0);
    const savedStreak = Number(window.localStorage.getItem(storageKey(address, 'streak')) || 0);
    const savedClaim = window.localStorage.getItem(storageKey(address, `claimed:${today}`)) === 'true';
    const savedTx = window.localStorage.getItem(storageKey(address, `tx:${today}`)) as `0x${string}` | null;
    setPoints(savedPoints);
    setStreak(savedStreak);
    setHasClaimed(savedClaim);
    setLastTxHash(savedTx && /^0x[a-fA-F0-9]+$/.test(savedTx) ? savedTx : undefined);
    if (savedClaim) {
      setMessage('Your onchain reward is active. Come back tomorrow to grow the streak.');
    } else {
      setMessage('Confirm the smart contract transaction to claim today\'s reward.');
    }
  }, [address]);

  useEffect(() => {
    if (!isConfirmed || !lastTxHash) return;
    void refetchClaimCount();
    setMessage(`Onchain claim confirmed: ${shortHash(lastTxHash)}`);
  }, [isConfirmed, lastTxHash, refetchClaimCount]);

  const walletText = useMemo(() => {
    if (address) return shortHash(address);
    return 'Connect';
  }, [address]);

  const chainText = useMemo(() => {
    if (!isConnected) return 'Wallet not connected';
    return chainId === base.id ? 'Base Mainnet' : `Wrong network (${chainId ?? 'unknown'})`;
  }, [chainId, isConnected]);

  async function handleClaim() {
    if (hasClaimed) {
      setMessage('Today has already been claimed. Your reward is visible now.');
      return;
    }

    if (!isConnected || !address) {
      setMessage('Choose a wallet first. The reward unlocks only after the smart contract transaction is signed.');
      setModalOpen(true);
      return;
    }

    if (!HAS_CONTRACT) {
      setMessage('Smart contract address is missing. Set NEXT_PUBLIC_CONTRACT_ADDRESS before claiming.');
      return;
    }

    const today = claimDate();

    try {
      if (chainId !== base.id) {
        setMessage('Switching to Base...');
        await switchChainAsync({ chainId: base.id });
      }

      setMessage('Waiting for smart contract confirmation in your wallet...');
      const hash = await writeContractAsync({
        address: SPARK_REWARD_CONTRACT,
        abi: SPARK_REWARD_ABI,
        functionName: 'claimSpark',
        args: ['Base Spark daily reward'],
        chainId: base.id,
        dataSuffix: ATTRIBUTION_DATA_SUFFIX,
      });
      setLastTxHash(hash);

      const nextPoints = points + DAILY_REWARD;
      const nextStreak = streak + 1;
      setPoints(nextPoints);
      setStreak(nextStreak);
      setHasClaimed(true);
      window.localStorage.setItem(storageKey(address, 'points'), String(nextPoints));
      window.localStorage.setItem(storageKey(address, 'streak'), String(nextStreak));
      window.localStorage.setItem(storageKey(address, `claimed:${today}`), 'true');
      window.localStorage.setItem(storageKey(address, `tx:${today}`), hash);
      setMessage(`Onchain claim submitted: ${shortHash(hash)}. Waiting for confirmation...`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The onchain claim was not completed.');
    }
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div className="brand" aria-label="Base Spark">
          <div className="brand-mark">
            <Sparkles size={19} strokeWidth={2.7} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Base Spark</span>
            <span className="brand-subtitle">Daily rewards on Base</span>
          </div>
        </div>
        <button className="wallet-button" type="button" onClick={() => setModalOpen(true)}>
          <Wallet size={17} />
          <span className="wallet-label">{walletText}</span>
        </button>
      </header>

      <section className="hero-grid">
        <div className="reward-card">
          <div className="eyebrow">
            <BadgeCheck size={15} />
            No token purchase required
          </div>
          <h1 className="title">Claim a warm daily spark.</h1>
          <p className="lead">
            Connect a wallet and confirm the smart contract transaction to unlock an
            instant visible reward with Base attribution-ready calldata.
          </p>

          <div className="stats-row">
            <div className="stat">
              <span className="stat-label">Spark balance</span>
              <span className="stat-value">{points}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Daily streak</span>
              <span className="stat-value">{streak}</span>
            </div>
          </div>
        </div>

        <div className="action-card">
          <div className="reward-meter">
            <div className="coin">
              <Gift size={28} />
            </div>
            <div className="meter-copy">
              <div className="meter-label">Today&apos;s reward</div>
              <div className="meter-value">+{DAILY_REWARD}</div>
              <div className="meter-note">Unlocked after onchain claim</div>
            </div>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={handleClaim}
            disabled={isWriting || isConfirming}
          >
            <Flame size={20} />
            {isConfirming ? 'Confirming...' : hasClaimed ? 'Reward Claimed' : isConnected ? 'Claim Onchain' : 'Connect to Claim'}
          </button>

          <p className="status">
            <strong>Status:</strong> {message}
          </p>
        </div>
      </section>

      <section className="contract-panel" aria-label="Contract interaction">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Contract interaction</h2>
            <p className="panel-copy">Read the connected wallet&apos;s claim count and inspect the latest write transaction.</p>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={() => void refetchClaimCount()}
            disabled={!HAS_CONTRACT || !address || isReadingClaims}
            aria-label="Refresh onchain claim count"
          >
            <RefreshCcw size={17} />
          </button>
        </div>

        <div className="contract-grid">
          <div className="contract-item">
            <span className="contract-label">Network</span>
            <span className="contract-value">{chainText}</span>
          </div>
          <div className="contract-item">
            <span className="contract-label">Claim count</span>
            <span className="contract-value">
              {!address ? 'Connect wallet' : isReadingClaims ? 'Loading...' : String(onchainClaimCount ?? 0)}
            </span>
          </div>
          <div className="contract-item">
            <span className="contract-label">Contract</span>
            {HAS_CONTRACT ? (
              <a className="contract-link" href={baseScanUrl(`address/${SPARK_REWARD_CONTRACT}`)} target="_blank" rel="noreferrer">
                <FileText size={15} />
                {shortHash(SPARK_REWARD_CONTRACT)}
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="contract-value warning">Missing env address</span>
            )}
          </div>
          <div className="contract-item">
            <span className="contract-label">Latest tx</span>
            {lastTxHash ? (
              <a className="contract-link" href={baseScanUrl(`tx/${lastTxHash}`)} target="_blank" rel="noreferrer">
                {shortHash(lastTxHash)}
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="contract-value">No transaction yet</span>
            )}
          </div>
        </div>
      </section>

      <section className="info-grid" aria-label="Reward details">
        <article className="info-card">
          <h2 className="info-title">Mobile first</h2>
          <p className="info-text">Built for the Base App browser with large touch targets and compact content.</p>
        </article>
        <article className="info-card">
          <h2 className="info-title">Wallet choice</h2>
          <p className="info-text">Use Coinbase Wallet, MetaMask, OKX, or any injected wallet provider.</p>
        </article>
        <article className="info-card">
          <h2 className="info-title">Attribution ready</h2>
          <p className="info-text">Offchain and onchain attribution placeholders are wired for final base.dev values.</p>
        </article>
      </section>

      {modalOpen ? (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="wallet-title">
            <div className="modal-head">
              <h2 className="modal-title" id="wallet-title">Choose wallet</h2>
              <button className="icon-button" type="button" onClick={() => setModalOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="choices">
              {connectors.map((connector) => (
                <button
                  className="choice-button"
                  key={connector.uid}
                  type="button"
                  disabled={isConnecting}
                  onClick={() => {
                    connect({ connector });
                    setModalOpen(false);
                  }}
                >
                  <span className="choice-icon">
                    <PlugZap size={19} />
                  </span>
                  <span>
                    <span className="choice-name">{connectorLabel(connector.name)}</span>
                    <span className="choice-copy">
                      {connector.type === 'coinbaseWallet'
                        ? 'Best for Coinbase Wallet users.'
                        : 'Works with Base App, MetaMask, OKX, and browser wallets.'}
                    </span>
                  </span>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>

            {isConnected ? (
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  disconnect();
                  setModalOpen(false);
                }}
              >
                Disconnect wallet
              </button>
            ) : null}
          </section>
        </div>
      ) : null}
    </main>
  );
}
