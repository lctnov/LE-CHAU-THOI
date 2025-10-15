import React from 'react';
import { TokenIcon } from './TokenIcon';

export interface WalletRowProps extends React.HTMLAttributes<HTMLDivElement> {
  blockchain?: string;
  currency?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

export const WalletRow: React.FC<WalletRowProps> = ({
  blockchain,
  currency,
  amount,
  usdValue,
  formattedAmount,
  className,
  ...rest
}) => {
  const usdText = `$${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  return (
    <div className={className} {...rest}>
      <div className="left">
        <TokenIcon symbol={currency} size={28} className="token-icon-img" />
        <div>
          <div className="amount-text">{currency}</div>
          <div className="sub"><span className="chain-chip">{blockchain}</span></div>
        </div>
      </div>
      <div className="right">
        <div className="amount-text">{formattedAmount}</div>
        <div className="usd-text">{usdText}</div>
      </div>
    </div>
  );
};

export const MemoWalletRow = React.memo(WalletRow);
