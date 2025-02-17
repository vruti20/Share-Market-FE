import { useEffect, useRef, useState } from "react";

const DrawArrow = ({ chartContainerRef, chartWidth, chartHeight }) => {
  const [arrows, setArrows] = useState([]);
  const currentArrow = useRef(null);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    if (!chartContainerRef.current) return;
    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    currentArrow.current = { start: { x: mouseX, y: mouseY }, end: { x: mouseX, y: mouseY } };
    isDrawing.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || !currentArrow.current) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    currentArrow.current.end = { x: e.clientX - left, y: e.clientY - top };

    // Force re-render by updating the state
    setArrows((prev) => [...prev.filter((a) => a !== null), currentArrow.current]);
  };

  const handleMouseUp = () => {
    if (isDrawing.current && currentArrow.current) {
      setArrows((prev) => [...prev, { ...currentArrow.current }]); // Save the arrow
      currentArrow.current = null; // Reset current arrow
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

  const drawArrowHead = (x1, y1, x2, y2) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowSize = 10;
    const arrowAngle = Math.PI / 6;

    const x3 = x2 - arrowSize * Math.cos(angle - arrowAngle);
    const y3 = y2 - arrowSize * Math.sin(angle - arrowAngle);

    const x4 = x2 - arrowSize * Math.cos(angle + arrowAngle);
    const y4 = y2 - arrowSize * Math.sin(angle + arrowAngle);

    return (
      <>
        <line x1={x2} y1={y2} x2={x3} y2={y3} stroke="red" strokeWidth="2" />
        <line x1={x2} y1={y2} x2={x4} y2={y4} stroke="red" strokeWidth="2" />
      </>
    );
  };

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
      {arrows.map((arrow, index) => {
        if (!arrow || !arrow.start || !arrow.end) return null;

        return (
          <g key={index}>
            <line
              x1={arrow.start.x}
              y1={arrow.start.y}
              x2={arrow.end.x}
              y2={arrow.end.y}
              stroke="red"
              strokeWidth="2"
            />
            {drawArrowHead(arrow.start.x, arrow.start.y, arrow.end.x, arrow.end.y)}
          </g>
        );
      })}
    </svg>
  );
};

export default DrawArrow;
