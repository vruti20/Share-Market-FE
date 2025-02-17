import React, { useState } from "react";
import TradingViewChart from "./trendingchart";
import LivePrice from "./liveprice";

function App() {
  const [showTradingView, setShowTradingView] = useState(true);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>TradingView Full Tools Chart</h1>
      <LivePrice />
      {showTradingView && <TradingViewChart />}
      
    </div>
  );
}

export default App;
