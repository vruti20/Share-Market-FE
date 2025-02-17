import { useRef, useEffect, useState } from "react";

const DrawRectangle = ({ chartContainerRef, chartWidth, chartHeight }) => {
  const [rectangles, setRectangles] = useState([]); // Store drawn rectangles
  const [currentRectangle, setCurrentRectangle] = useState(null); // Track active rectangle
  const isDrawing = useRef(false); // Track drawing state

  const handleMouseDown = (e) => {
    if (!chartContainerRef.current) return;
    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    setCurrentRectangle({ x: mouseX, y: mouseY, width: 0, height: 0 });
    isDrawing.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || !currentRectangle) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const updatedRectangle = {
      ...currentRectangle,
      width: mouseX - currentRectangle.x,
      height: mouseY - currentRectangle.y,
    };

    setCurrentRectangle(updatedRectangle);
  };

  const handleMouseUp = () => {
    if (isDrawing.current && currentRectangle) {
      setRectangles((prev) => [...prev, currentRectangle]); // Save rectangle
      setCurrentRectangle(null); // Reset drawing state
    }
    isDrawing.current = false;
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
  }, [currentRectangle]); // Depend on `currentRectangle` to update in real-time

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
      {/* Render completed rectangles */}
      {rectangles.map((rect, index) => (
        <rect
          key={index}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          fill="rgba(0, 0, 255, 0.3)"
          stroke="blue"
          strokeWidth="2"
        />
      ))}

      {/* Render active rectangle while dragging */}
      {currentRectangle && (
        <rect
          x={currentRectangle.x}
          y={currentRectangle.y}
          width={currentRectangle.width}
          height={currentRectangle.height}
          fill="rgba(255, 0, 0, 0.3)"
          stroke="red"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
      )}
    </svg>
  );
};

export default DrawRectangle;
