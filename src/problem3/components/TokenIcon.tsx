import React from 'react';

const ICON_BASE = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export interface TokenIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  symbol?: string;
  size?: number;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ symbol = '', size = 28, className = '', ...rest }) => {
  const sym = (symbol || '').toUpperCase();
  const initial = `${ICON_BASE}/${encodeURIComponent(sym)}.svg`;
  const [src, setSrc] = React.useState(initial);

  React.useEffect(() => {
    setSrc(initial);
  }, [initial]);

  return (
    <img
      src={src}
      alt={`${sym} icon`}
      width={size}
      height={size}
      className={`token-icon-img ${className}`}
      onError={() => {
        if (!src.includes('default.png')) setSrc('/tokens/default.png');
      }}
      {...rest}
    />
  );
};
