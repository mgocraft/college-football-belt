// components/AdUnit.js
import { useEffect, useRef } from 'react';

export default function AdUnit({
  adClient = 'ca-pub-7568133290427764',
  adSlot,                 // e.g. "9168138847"
  format = 'auto',
  fullWidthResponsive = true,
  style = { display: 'block' }, // keep block for responsive
  className = '',
}) {
  const ref = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <ins
      ref={ref}
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  );
}
