// pages/_app.js
import Script from 'next/script';


export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-5K4ZNLRJK7"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5K4ZNLRJK7', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
        <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7568133290427764"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
       {/* Google AdSense Auto Ads */}
      <Script
        id="adsense-auto-ads"
        strategy="afterInteractive"
        data-ad-client="ca-pub-7568133290427764"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      />

      

      {/* Render all pages */}
      <Component {...pageProps} />
    </>
  );
}
