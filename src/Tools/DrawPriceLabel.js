import { useEffect, useRef, useState } from "react";

const DrawPriceLabel = ({ chartContainerRef, chartWidth, chartHeight, getPriceFromY }) => {
  const [labels, setLabels] = useState([]);
  const isDragging = useRef(null);

  const handleMouseDown = (e) => {
    if (!chartContainerRef.current) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const price = getPriceFromY(mouseY); // Convert Y position to price

    const newLabel = { x: mouseX, y: mouseY, price };
    setLabels((prev) => [...prev, newLabel]);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const price = getPriceFromY(mouseY);

    setLabels((prev) =>
      prev.map((label, index) =>
        index === isDragging.current ? { ...label, x: mouseX, y: mouseY, price } : label
      )
    );
  };

  const handleMouseUp = () => {
    isDragging.current = null;
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
      {labels.map((label, index) => (
        <g key={index}>
          <rect
            x={label.x - 25}
            y={label.y - 15}
            width="50"
            height="20"
            fill="black"
            rx="5"
            ry="5"
            opacity="0.7"
          />
          <text
            x={label.x}
            y={label.y}
            fill="white"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {label.price.toFixed(2)}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default DrawPriceLabel;