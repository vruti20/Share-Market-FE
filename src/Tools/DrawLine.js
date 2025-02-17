import { useRef, useState, useEffect } from "react";

const DrawLine = ({ chartContainerRef, chartWidth, chartHeight }) => {
  const [lines, setLines] = useState([]); // Stores all drawn lines
  const [currentLine, setCurrentLine] = useState(null); // Currently drawing line
  const isDrawing = useRef(false); // Track drawing state

  const handleMouseDown = (e) => {
    if (!chartContainerRef.current) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const newLine = { start: { x: mouseX, y: mouseY }, end: { x: mouseX, y: mouseY } };
    setCurrentLine(newLine); // Start tracking this line
    isDrawing.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || !currentLine) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const newEnd = { x: e.clientX - left, y: e.clientY - top };

    setCurrentLine((prev) => prev ? { ...prev, end: newEnd } : null); // Update end point
  };

  const handleMouseUp = () => {
    if (isDrawing.current && currentLine) {
      setLines((prev) => [...prev, currentLine]); // Save the completed line
      setCurrentLine(null); // Reset drawing line
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
  }, [currentLine]); // Re-run when drawing changes

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: chartWidth,
        height: chartHeight,
        pointerEvents: "none"
      }}
    >
      {/* Draw completed lines */}
      {lines.map((line, index) => (
        <line
          key={index}
          x1={line.start.x}
          y1={line.start.y}
          x2={line.end.x}
          y2={line.end.y}
          stroke="blue"
          strokeWidth="2"
        />
      ))}

      {/* Draw active line while dragging */}
      {currentLine && (
        <line
          x1={currentLine.start.x}
          y1={currentLine.start.y}
          x2={currentLine.end.x}
          y2={currentLine.end.y}
          stroke="red"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}
    </svg>
  );
};

export default DrawLine;
