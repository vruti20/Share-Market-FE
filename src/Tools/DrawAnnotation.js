import React, { useState, useEffect, useRef } from "react";

const DrawAnnotation = ({ chartContainerRef, chartWidth, chartHeight, isActive }) => {
  const [annotationText, setAnnotationText] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [draggingAnnotation, setDraggingAnnotation] = useState(null); // Track which annotation is being dragged
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset to track movement during drag
  const inputRef = useRef(null);

  // Handle the click event to add annotation
  const handleClick = (event) => {
    if (isActive && !draggingAnnotation) {
      const rect = chartContainerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (annotationText.trim()) {
        setAnnotations((prevAnnotations) => [
          ...prevAnnotations,
          { x, y, text: annotationText, isSaved: false }, // Add isSaved field
        ]);
        setAnnotationText(""); // Reset text input after adding
      }
    }
  };

  // Handle mouse down to start dragging annotation
  const handleAnnotationMouseDown = (event, annotationIndex) => {
    setDraggingAnnotation(annotationIndex);
    const offsetX = event.clientX - annotations[annotationIndex].x;
    const offsetY = event.clientY - annotations[annotationIndex].y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  // Handle the mouse move event to drag annotation
  const handleMouseMove = (event) => {
    if (draggingAnnotation !== null) {
      const updatedAnnotations = [...annotations];
      updatedAnnotations[draggingAnnotation] = {
        ...updatedAnnotations[draggingAnnotation],
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y,
      };
      setAnnotations(updatedAnnotations);
    }
  };

  // Stop dragging when mouse is up
  const handleMouseUp = () => {
    setDraggingAnnotation(null);
    // After drag ends, mark annotation as saved (or "disappear" the input)
    if (draggingAnnotation !== null) {
      const updatedAnnotations = [...annotations];
      updatedAnnotations[draggingAnnotation].isSaved = true; // Mark annotation as saved
      setAnnotations(updatedAnnotations);
    }
  };

  // Apply mouse move and up event listeners for dragging
  useEffect(() => {
    if (draggingAnnotation !== null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingAnnotation, annotations]);

  // Handle saving the annotation when double-clicked
  const handleDoubleClick = (index) => {
    const updatedAnnotations = [...annotations];
    updatedAnnotations[index].isSaved = true; // Mark as saved
    setAnnotations(updatedAnnotations);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: chartWidth,
        height: chartHeight,
      }}
      onClick={handleClick} // Allow clicks to place annotations
    >
      {annotations.map((annotation, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: annotation.x,
            top: annotation.y,
            zIndex: 10,
            cursor: "move",
          }}
          onMouseDown={(e) => handleAnnotationMouseDown(e, index)}
          onDoubleClick={() => handleDoubleClick(index)} // Double click to save
        >
          {!annotation.isSaved && (
            <input
              type="text"
              value={annotation.text}
              onChange={(e) => {
                const updatedAnnotations = [...annotations];
                updatedAnnotations[index].text = e.target.value;
                setAnnotations(updatedAnnotations);
              }}
              style={{
                padding: "5px",
                width: "150px",
                borderRadius: "3px",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "black",
              }}
            />
          )}
          {annotation.isSaved && (
            <div
              style={{
                padding: "2px 5px",
                borderRadius: "3px",
                fontSize: "12px",
                color: "black",
              }}
            >
              {annotation.text}
            </div>
          )}
        </div>
      ))}

      {isActive && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            backgroundColor: "white",
            padding: "5px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            cursor: "move",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            placeholder="Type your annotation..."
            style={{
              padding: "5px",
              width: "200px",
              borderRadius: "3px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DrawAnnotation;