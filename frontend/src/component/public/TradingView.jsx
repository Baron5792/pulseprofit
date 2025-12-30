// TradingViewWidget.jsx - Fixed version
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef();
  const scriptAdded = useRef(false); // Track if script was already added

  useEffect(() => {
    // Prevent duplicate script execution
    if (scriptAdded.current || !container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          {
            "proName": "FOREXCOM:SPXUSD",
            "title": "S&P 500 Index"
          },
          {
            "proName": "FOREXCOM:NSXUSD",
            "title": "US 100 Cash CFD"
          },
          {
            "proName": "FX_IDC:EURUSD",
            "title": "EUR to USD"
          },
          {
            "proName": "BITSTAMP:BTCUSD",
            "title": "Bitcoin"
          },
          {
            "proName": "BITSTAMP:ETHUSD",
            "title": "Ethereum"
          }
        ],
        "colorTheme": "light",
        "locale": "en",
        "largeChartUrl": "",
        "isTransparent": false,
        "showSymbolLogo": true,
        "displayMode": "adaptive"
      }`;
    
    container.current.appendChild(script);
    scriptAdded.current = true; // Mark as added

    // Cleanup function
    return () => {
      if (container.current && script.parentNode) {
        container.current.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewWidget);