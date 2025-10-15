"use client";

import { useMemo } from 'react';
import { MemoWalletRow } from '../components/WalletRow';
import { usePrices, useWalletBalances } from '../hooks';


interface WalletBalance {
  blockchain: string;
  currency: string;
  amount: number;
}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis': return 100;
    case 'Ethereum': return 50;
    case 'Arbitrum': return 30;
    case 'Zilliqa':
    case 'Neo': return 20;
    default: return -99;
  }
};

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function WalletPage() {
  const balances = useWalletBalances();
  const prices = usePrices();
  
  const sortedBalances = useMemo(() => {
    return (balances as WalletBalance[])
      .map((b) => ({ ...b, priority: getPriority(b.blockchain) }))
      .filter((b) => b.priority > -99 && b.amount > 0)
      .sort((a, b) => b.priority - a.priority);
  }, [balances]);

  const rows = useMemo(() => {
    return sortedBalances.map((balance) => {
      const usd = (prices[balance.currency] ?? 0) * balance.amount;
      return (
        <MemoWalletRow
          key={`${balance.blockchain}-${balance.currency}`}
          blockchain={balance.blockchain}
          currency={balance.currency}
          amount={balance.amount}
          usdValue={usd}
          formattedAmount={numberFormatter.format(balance.amount)}
          className="wallet-row"
        />
      );
    });
  }, [sortedBalances, prices]);

  const totalUsd = useMemo(() => {
    return sortedBalances.reduce((acc, b) => acc + (prices[b.currency] ?? 0) * b.amount, 0);
  }, [sortedBalances, prices]);

  return (
    <div className="container-page">
      <div className="card">
        <div className="card-header">
          <h1 className="page-title">Wallet Balances</h1>
          <div className="total-text">
            Total: <span className="total-value">${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div>{rows}</div>
      </div>
    </div>
  );
}
