import { useEffect, useRef, useState } from "react";

const DrawBrush = ({ chartContainerRef, chartWidth, chartHeight }) => {
  const [paths, setPaths] = useState([]);
  const currentPath = useRef("");

  const handleMouseDown = (e) => {
    if (!chartContainerRef.current) return;
    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    currentPath.current = `M${x},${y}`;
  };

  const handleMouseMove = (e) => {
    if (!currentPath.current) return;
    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    currentPath.current += ` L${x},${y}`;

    // Update paths immediately by using the functional setState approach
    setPaths((prevPaths) => [...prevPaths, currentPath.current]);
  };

  const handleMouseUp = () => {
    if (currentPath.current) {
      // Finalize path when mouse is released (no changes needed here for the path)
      currentPath.current = "";
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
      {paths.map((path, index) => (
        <path key={index} d={path} stroke="black" strokeWidth="2" fill="none" />
      ))}
    </svg>
  );
};

export default DrawBrush;
