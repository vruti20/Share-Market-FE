import React, { useEffect, useRef, useState } from "react";

const DrawCustomNotes = ({ chartContainerRef, chartWidth, chartHeight }) => {
  const [notes, setNotes] = useState([]);
  const currentNote = useRef(null);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    if (!chartContainerRef.current) return;
    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Ensure we start drawing the note
    currentNote.current = { x: mouseX, y: mouseY, text: "", id: Date.now() };
    isDrawing.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || !currentNote.current) return;

    const { left, top } = chartContainerRef.current.getBoundingClientRect();
    currentNote.current.x = e.clientX - left;
    currentNote.current.y = e.clientY - top;

    // Trigger re-render to show the current position of the note
    setNotes((prev) => [...prev]);
  };

  const handleMouseUp = () => {
    if (isDrawing.current && currentNote.current) {
      setNotes((prev) => [...prev, currentNote.current]);
      currentNote.current = null;
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
      {notes.map((note, index) => {
        if (!note || note.x == null || note.y == null) return null;

        return (
          <g key={note.id}>
            <circle cx={note.x} cy={note.y} r="5" fill="blue" />
            <text
              x={note.x + 10}
              y={note.y}
              fontSize="12"
              fill="blue"
              dominantBaseline="middle"
              textAnchor="start"
            >
              {note.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default DrawCustomNotes;
