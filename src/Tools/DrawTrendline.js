import { useEffect, useRef, useState } from "react";

const DrawTrendline = ({ chartContainerRef, chartWidth, chartHeight }) => {
  const [trendlines, setTrendlines] = useState([]);
  const currentTrendline = useRef(null);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    if (!chartContainerRef.current) return;
    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    currentTrendline.current = { start: { x: mouseX, y: mouseY }, end: { x: mouseX, y: mouseY } };
    isDrawing.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || !currentTrendline.current) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    currentTrendline.current.end = { x: e.clientX - left, y: e.clientY - top };

    // Force re-render by updating the state
    setTrendlines((prev) => [...prev.filter((t) => t !== null), currentTrendline.current]);
  };

  const handleMouseUp = () => {
    if (isDrawing.current && currentTrendline.current) {
      setTrendlines((prev) => [...prev, { ...currentTrendline.current }]); // Save the trendline
      currentTrendline.current = null; // Reset current trendline
      isDrawing.current = false;
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = chartContainerRef.current;

    chart.addEventListener("mousedown", handleMouseDown);
    chart.addEventListener("mousemove", handleMouseMove);
    chart.addEventListener("mouseup", handleMouseUp);

    return () => {
      chart.removeEventListener("mousedown", handleMouseDown);
      chart.removeEventListener("mousemove", handleMouseMove);
      chart.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: chartWidth,
        height: chartHeight,
        pointerEvents: "none",
      }}
    >
      {trendlines.map((trendline, index) => {
        if (!trendline || !trendline.start || !trendline.end) return null;

        return (
          <line
            key={index}
            x1={trendline.start.x}
            y1={trendline.start.y}
            x2={trendline.end.x}
            y2={trendline.end.y}
            stroke="green"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
};

export default DrawTrendline;