// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';
// Assuming you still need to import your CSS module
import styles from '../../assets/css/user/TradingView.module.css';

function DashboardWidget() {
  const container = useRef();

  useEffect(
    () => {
      // 1. Initial check (Good practice)
      if (!container.current) {
        return;
      }

      // Optional check to prevent adding if the script is already there
      if (container.current.querySelector('script[src*="tradingview"]')) {
          return;
      }
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "allow_symbol_change": true,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "D",
          "locale": "en",
          "save_image": true,
          "style": "1",
          "symbol": "BITSTAMP:BTCUSD",
          "theme": "light",
          "timezone": "Etc/UTC",
          "backgroundColor": "#ffffff",
          "gridColor": "rgba(46, 46, 46, 0.06)",
          "watchlist": [],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [],
          "autosize": true
        }`;
        
      container.current.appendChild(script);

      // 🛑 THE FIX: Add the cleanup function to remove the content on unmount/re-run
      return () => {
        // If the ref is null, stop the cleanup immediately!
        if (container.current) { 
          // Clear all content (script and generated iframe) injected by the external library
          container.current.innerHTML = '';
        }
      };
    },
    [] // Empty dependency array means the effect runs once on mount
  );

  return (
      <div className={`${styles['tradingview-widget-container']}`} ref={container}>
      </div>
  )
}

export default memo(DashboardWidget);