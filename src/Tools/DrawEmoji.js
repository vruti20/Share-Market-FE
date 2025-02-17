import { useEffect, useRef, useState } from "react";

const DrawEmoji = ({ chartContainerRef, chartWidth, chartHeight }) => {
    const [emojis, setEmojis] = useState([]);
    const currentEmoji = useRef(null);
  
    const handleMouseClick = (e) => {
      if (!chartContainerRef.current) return;
  
      const { left, top } = chartContainerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;
  
      // Add the emoji at the clicked position
      setEmojis((prev) => [
        ...prev,
        { emoji: "😊", x: mouseX, y: mouseY } // Use your emoji of choice
      ]);
    };
  
    useEffect(() => {
      if (!chartContainerRef.current) return;
      const chart = chartContainerRef.current;
  
      chart.addEventListener("click", handleMouseClick);
  
      return () => {
        chart.removeEventListener("click", handleMouseClick);
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
          pointerEvents: "none"
        }}
      >
        {emojis.map((emoji, index) => (
          <text
            key={index}
            x={emoji.x}
            y={emoji.y}
            fontSize="20"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {emoji.emoji}
          </text>
        ))}
      </svg>
    );
  };
export default DrawEmoji;