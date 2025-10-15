"use client";

import { useEffect, useMemo, useState } from 'react';

export interface WalletBalance {
  blockchain: string;
  currency: string;
  amount: number;
}

const PRICE_URL = 'https://interview.switcheo.com/prices.json';

export function useWalletBalances(): WalletBalance[] {
  // Mocked example data; amounts > 0 to pass filter
  return useMemo(
    () => [
      { blockchain: 'Osmosis', currency: 'SWTH', amount: 1203.42 },
      { blockchain: 'Ethereum', currency: 'ETH', amount: 1.2345 },
      { blockchain: 'Arbitrum', currency: 'USDC', amount: 3021.77 },
      { blockchain: 'Zilliqa', currency: 'ZIL', amount: 5400.0 },
      { blockchain: 'Neo', currency: 'NEO', amount: 35.75 },
      { blockchain: 'Unknown', currency: 'ABC', amount: 0 },
    ],
    []
  );
}

export function usePrices(): Record<string, number> {
  const [prices, setPrices] = useState<Record<string, number>>({
    // sensible defaults so UI renders even if fetch fails
    ETH: 3500,
    USDC: 1,
    SWTH: 0.02,
    ZIL: 0.025,
    NEO: 15,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(PRICE_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch prices');
        const data = await res.json();
        const map = new Map<string, number>();
        if (Array.isArray(data)) {
          for (const item of data) {
            const sym = String(item?.currency || item?.symbol || '').toUpperCase();
            const p = Number(item?.price);
            if (!sym || !isFinite(p)) continue;
            map.set(sym, p);
          }
        } else if (data && typeof data === 'object') {
          for (const [k, v] of Object.entries(data)) {
            const sym = String(k).toUpperCase();
            const p = Number((v as any)?.price ?? (v as any));
            if (!isFinite(p)) continue;
            map.set(sym, p);
          }
        }
        if (!cancelled) setPrices(Object.fromEntries(map));
      } catch (err) {
        // keep defaults
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return prices;
}
