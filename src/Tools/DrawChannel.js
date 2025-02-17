import { useEffect, useRef, useState } from "react";

const DrawChannel = ({ chartContainerRef, chartWidth, chartHeight }) => {
  const [channels, setChannels] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentChannel = useRef(null);

  // 🖱 Start drawing on mouse down
  const handleMouseDown = (e) => {
    if (!chartContainerRef.current) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Start a new channel
    currentChannel.current = {
      start: { x: mouseX, y: mouseY },
      end: { x: mouseX, y: mouseY },
    };
    setIsDrawing(true);
  };

  // 🎨 Update drawing as the mouse moves
  const handleMouseMove = (e) => {
    if (!isDrawing || !currentChannel.current) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    currentChannel.current = {
      ...currentChannel.current,
      end: { x: mouseX, y: mouseY },
    };

    // 🛠 Trigger re-render
    setChannels((prev) => [...prev.slice(0, -1), currentChannel.current]);
  };

  // ✅ Finalize drawing on mouse up
  const handleMouseUp = () => {
    if (isDrawing && currentChannel.current) {
      setChannels((prev) => [...prev, currentChannel.current]);
      currentChannel.current = null; // Reset for new drawings
      setIsDrawing(false);
    }
  };

  // 🎯 Attach & remove event listeners
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
  }, [isDrawing]); // 🔄 React will re-run when `isDrawing` changes

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
      {channels.map((channel, index) => {
        if (!channel || !channel.start || !channel.end) return null;

        const dx = channel.end.x - channel.start.x;
        const dy = channel.end.y - channel.start.y;

        return (
          <g key={index}>
            {/* Main trendline */}
            <line
              x1={channel.start.x}
              y1={channel.start.y}
              x2={channel.end.x}
              y2={channel.end.y}
              stroke="orange"
              strokeWidth="2"
            />
            {/* Parallel upper line */}
            <line
              x1={channel.start.x}
              y1={channel.start.y - dy * 0.3}
              x2={channel.end.x}
              y2={channel.end.y - dy * 0.3}
              stroke="orange"
              strokeWidth="2"
            />
            {/* Parallel lower line */}
            <line
              x1={channel.start.x}
              y1={channel.start.y + dy * 0.3}
              x2={channel.end.x}
              y2={channel.end.y + dy * 0.3}
              stroke="orange"
              strokeWidth="2"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default DrawChannel;
