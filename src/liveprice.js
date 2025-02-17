import React, { useEffect, useState } from "react";

const LivePrice = () => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.p).toFixed(2)); // Extracting price
    };

    return () => ws.close(); // Cleanup WebSocket on unmount
  }, []);

  return (
    <div style={{ fontSize: "20px", fontWeight: "bold", margin: "10px 0" }}>
      Live BTC/USDT Price: ${price}
    </div>
  );
};

export default LivePrice;
