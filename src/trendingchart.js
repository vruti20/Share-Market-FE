import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  XAxis,
  YAxis,
  CrossHairCursor,
  CurrentCoordinate,
  MouseCoordinateX,
  MouseCoordinateY,
  discontinuousTimeScaleProvider,
  ZoomButtons,
} from "react-financial-charts";
import DrawLine from "./Tools/DrawLine";
import DrawRectangle from "./Tools/Drawrectangle";
import DrawRuler from "./Tools/DrawRuler";
import DrawBrush from "./Tools/DrawBrush";
import DrawAnnotation from "./Tools/DrawAnnotation";
import DrawChannel from "./Tools/DrawChannel";
import DrawEmoji from "./Tools/DrawEmoji";
import DrawFibonacci from "./Tools/DrawFibonacci";
import DrawTrendline from "./Tools/DrawTrendline";
import DrawArrow from "./Tools/DrawArrow";
import DrawPriceLabel from "./Tools/DrawPriceLabel";
import DrawCustomNotes from "./Tools/DrawCustomNotes";

// Tool definitions
const tools = [
  { name: "Draw Line", icon: "✏" },
  { name: "Rectangle", icon: "🔲" },
  { name: "Ruler", icon: "📏" },
  { name: "Brush", icon: "🖌" },
  { name: "Channel", icon: "📊" },
  { name: "Annotation", icon: "✍" },
  { name: "Emoji", icon: "😊" },
  { name: "Fibonacci", icon: "📐" },
  { name: "Trendline", icon: "📈" },
  { name: "Arrow", icon: "➡️" },
  { name: "Price Label", icon: "🏷️" },
  { name: "Custom Notes", icon: "📝" }
];

const SidebarTools = ({ onSelectTool }) => (
  <div className="flex flex-col space-y-2 p-2 border-r border-gray-300 bg-gray-100">
    {tools.map(({ name, icon }) => (
      <button
        key={name}
        className="p-2 hover:bg-gray-300 rounded"
        onClick={() => onSelectTool(name)}
      >
        {icon}
      </button>
    ))}
  </div>
);

const BinanceCandleChart = () => {
  const [data, setData] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const chartContainerRef = useRef(null);
  const [chartDimensions, setChartDimensions] = useState({
    width: 800,
    height: 400,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=100"
        );
        setData(
          res.data.map((candle) => ({
            date: new Date(candle[0]),
            open: +candle[1],
            high: +candle[2],
            low: +candle[3],
            close: +candle[4],
          }))
        );
      } catch (err) {
        console.error("Error fetching Binance data:", err);
      }
    };
    fetchData();
  }, []);

  const {
    data: chartData,
    xScale,
    xAccessor,
    displayXAccessor,
  } = discontinuousTimeScaleProvider.inputDateAccessor((d) => d.date)(data);

  const prices = data.map((d) => d.close); // Get closing prices
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  const getPriceFromY = (y) => {
    const priceRange = maxPrice - minPrice;
    return maxPrice - (y / chartDimensions.height) * priceRange;
  };

  return (
    <div className="flex">
      <SidebarTools onSelectTool={setActiveTool} />
      <div style={{ position: "relative" }} ref={chartContainerRef}>
        <h2 className="text-xl font-bold mb-2">BTC/USDT Candlestick Chart</h2>
        {data.length ? (
          <>
            <ChartCanvas
              width={chartDimensions.width}
              height={chartDimensions.height}
              ratio={3}
              margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
              data={chartData}
              xScale={xScale}
              xAccessor={xAccessor}
              displayXAccessor={displayXAccessor}
              seriesName="BTCUSDT"
            >
              <Chart id={1} yExtents={(d) => [d.high, d.low]}>
                <XAxis />
                <YAxis />
                <MouseCoordinateX
                  displayFormat={(d) => d.toLocaleTimeString()}
                />
                <MouseCoordinateY displayFormat={(d) => d.toFixed(2)} />
                <CandlestickSeries />
                <CurrentCoordinate yAccessor={(d) => d.close} />
                <ZoomButtons />
              </Chart>
              <CrossHairCursor />
            </ChartCanvas>

            {/* Attach Drawing Tools */}
            {activeTool === "Draw Line" && (
              <DrawLine
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
              />
            )}
            {activeTool === "Rectangle" && (
              <DrawRectangle
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
              />
            )}
            {activeTool === "Ruler" && (
              <DrawRuler
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
              />
            )}
            {activeTool === "Brush" && (
              <DrawBrush
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
              />
            )}
            {activeTool === "Channel" && (
              <DrawChannel
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
              />
            )}
            {/* Attach Annotation Tool */}
            {activeTool === "Annotation" && (
              <DrawAnnotation
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
                isActive={true} // Enable annotation input
              />
            )}
            {activeTool === "Emoji" && (
              <DrawEmoji
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
              />
            )}
            {activeTool === "Fibonacci" && (
              <DrawFibonacci
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
              />
            )}
            {activeTool === "Trendline" && (
              <DrawTrendline
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
              />
            )}
            {activeTool === "Arrow" && (
              <DrawArrow
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
              />
            )}
            {activeTool === "Price Label" && (
              <DrawPriceLabel
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
                getPriceFromY={getPriceFromY} // A function to map Y-coordinates to price
              />
            )}
            {activeTool === "Custom Notes" && (
              <DrawCustomNotes
                chartContainerRef={chartContainerRef}
                chartWidth={chartDimensions.width}
                chartHeight={chartDimensions.height}
              />
            )}
          </>
        ) : (
          <p className="text-center">Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default BinanceCandleChart;
