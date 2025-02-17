import { useRef, useState, useEffect } from "react";

const DrawRuler = ({ chartContainerRef, chartWidth, chartHeight }) => {
  const [rulers, setRulers] = useState([]);
  const [currentRuler, setCurrentRuler] = useState(null); // Use state to track current ruler
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    if (!chartContainerRef.current) return;
    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    setCurrentRuler({
      start: { x: mouseX, y: mouseY },
      end: { x: mouseX, y: mouseY },
    });
    isDrawing.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || !currentRuler) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    setCurrentRuler((prevRuler) => ({
      ...prevRuler,
      end: { x: mouseX, y: mouseY },
    }));
  };

  const handleMouseUp = () => {
    if (isDrawing.current && currentRuler) {
      setRulers((prev) => [...prev, currentRuler]);
      setCurrentRuler(null); // Reset current ruler after drawing is finished
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
  }, [currentRuler]); // Re-run effect if `currentRuler` changes

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
      {/* Render completed rulers */}
      {rulers.map((ruler, index) => {
        const dx = ruler.end.x - ruler.start.x;
        const dy = ruler.end.y - ruler.start.y;
        const distance = Math.sqrt(dx * dx + dy * dy).toFixed(2);

        return (
          <g key={index}>
            <line
              x1={ruler.start.x}
              y1={ruler.start.y}
              x2={ruler.end.x}
              y2={ruler.end.y}
              stroke="red"
              strokeWidth="2"
            />
            <text
              x={(ruler.start.x + ruler.end.x) / 2}
              y={(ruler.start.y + ruler.end.y) / 2}
              fill="red"
            >
              {distance}px
            </text>
          </g>
        );
      })}

      {/* Render the current ruler while drawing */}
      {currentRuler && (
        <g>
          <line
            x1={currentRuler.start.x}
            y1={currentRuler.start.y}
            x2={currentRuler.end.x}
            y2={currentRuler.end.y}
            stroke="red"
            strokeWidth="2"
          />
          <text
            x={(currentRuler.start.x + currentRuler.end.x) / 2}
            y={(currentRuler.start.y + currentRuler.end.y) / 2}
            fill="red"
          >
            {Math.sqrt(
              Math.pow(currentRuler.end.x - currentRuler.start.x, 2) +
                Math.pow(currentRuler.end.y - currentRuler.start.y, 2)
            ).toFixed(2)}
            px
          </text>
        </g>
      )}
    </svg>
  );
};

export default DrawRuler;