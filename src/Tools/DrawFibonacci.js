import { useEffect, useRef, useState } from "react";

const DrawFibonacci = ({ chartContainerRef, chartWidth, chartHeight }) => {
  const [retracements, setRetracements] = useState([]);
  const currentRetracement = useRef(null);
  const isDrawing = useRef(false);

  const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]; // Fibonacci levels

  const handleMouseDown = (e) => {
    if (!chartContainerRef.current) return;
    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    currentRetracement.current = { start: { x: mouseX, y: mouseY }, end: { x: mouseX, y: mouseY } };
    isDrawing.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || !currentRetracement.current) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    currentRetracement.current.end = { x: e.clientX - left, y: e.clientY - top };

    // Force re-render properly
    setRetracements((prev) => [...prev.filter((r) => r !== null), currentRetracement.current]);
  };

  const handleMouseUp = () => {
    if (isDrawing.current && currentRetracement.current) {
      setRetracements((prev) => [...prev, { ...currentRetracement.current }]); // Save final retracement
      currentRetracement.current = null; // Reset current retracement
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
      {retracements.map((retracement, index) => {
        if (!retracement || !retracement.start || !retracement.end) return null;

        const minY = Math.min(retracement.start.y, retracement.end.y);
        const maxY = Math.max(retracement.start.y, retracement.end.y);

        return (
          <g key={index}>
            {fibLevels.map((level) => {
              const y = minY + (maxY - minY) * level;
              return (
                <line
                  key={level}
                  x1={retracement.start.x}
                  y1={y}
                  x2={retracement.end.x}
                  y2={y}
                  stroke="blue"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

export default DrawFibonacci;