import React, { useEffect, useRef, useState } from "react";

// CONCEPT OF CLOSEST CENTER COLLISION ALGORITHM
const DndNativeDistance: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggableRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const DISTANCE = 25;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !draggableRef.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const draggableRect = draggableRef.current.getBoundingClientRect();

      let newX = event.clientX - offset.x - containerRect.left;
      let newY = event.clientY - offset.y - containerRect.top;

      newX = Math.max(
        0,
        Math.min(containerRect.width - draggableRect.width, newX)
      );
      newY = Math.max(
        0,
        Math.min(containerRect.height - draggableRect.height, newY)
      );

      requestAnimationFrame(() => {
        setPosition({ x: newX, y: newY });
      });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (containerRef.current && draggableRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const draggableRect = draggableRef.current.getBoundingClientRect();

          const centerX = containerRect.width / 2;
          const centerY = containerRect.height / 2;

          const elementCenterX =
            draggableRect.left + draggableRect.width / 2 - containerRect.left;
          const elementCenterY =
            draggableRect.top + draggableRect.height / 2 - containerRect.top;

          // Euclidean distance formula
          const distance = Math.sqrt(
            Math.pow(centerX - elementCenterX, 2) +
              Math.pow(centerY - elementCenterY, 2)
          );

          if (distance > DISTANCE) {
            // if distance is outside threshold "not within the threshold"
            setPosition(initialPosition);
          }
        }
      }
    };

    if (isDragging) {
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
  }, [isDragging, initialPosition, offset]);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (draggableRef.current && containerRef.current) {
      const draggableRect = draggableRef.current.getBoundingClientRect();

      const offsetX = event.clientX - draggableRect.left;
      const offsetY = event.clientY - draggableRect.top;

      // const initialX = event.clientX - containerRect.left - offsetX; // 0 -> 100
      // const initialY = event.clientY - containerRect.top - offsetY; // 0 -> 100

      setInitialPosition({ x: 0, y: 0 });
      setOffset({
        x: offsetX,
        y: offsetY,
      });

      setIsDragging(true);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "400px",
        height: "300px",
        position: "relative",
        border: "2px solid black",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${DISTANCE}px`,
          height: `${DISTANCE}px`,
          borderRadius: "100%",
          backgroundColor: "red",
        }}
      />
      <div>
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${DISTANCE}px`,
            height: `${DISTANCE}px`,
            borderRadius: "100%",
            backgroundColor: "red",
          }}
        />
      </div>
      <div
        ref={draggableRef}
        onMouseDown={handleMouseDown}
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: "rgba(173, 216, 230, 0.3)",
          cursor: "grab",
          userSelect: "none",
          position: "absolute",
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: isDragging ? "none" : "transform 0.35s ease",
          pointerEvents: "all",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${DISTANCE}px`,
            height: `${DISTANCE}px`,
            borderRadius: "100%",
            backgroundColor: "yellow",
          }}
        />
      </div>
    </div>
  );
};

export default DndNativeDistance;
