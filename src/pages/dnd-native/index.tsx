import React, { useEffect, useRef, useState } from "react";
import { calculateDroppableBounds } from "../../utils";

const DndNativeDroppable: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggableRef = useRef<HTMLDivElement | null>(null);
  const droppableRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (
        !isDragging ||
        !draggableRef.current ||
        !containerRef.current ||
        !droppableRef.current
      )
        return;

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

      positionRef.current = {
        x: newX,
        y: newY,
      };

      requestAnimationFrame(() => {
        setPosition({ x: newX, y: newY });
      });
    };

    const handleMouseUp = () => {
      if (!isDragging) return;

      setIsDragging(false);

      if (
        !containerRef.current ||
        !draggableRef.current ||
        !droppableRef.current
      )
        return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const droppableRect = droppableRef.current.getBoundingClientRect();
      const draggableRect = draggableRef.current.getBoundingClientRect();

      // 200 -> 400 (x axis)
      // 300 -> 400 (y axis)
      // with respect to the container

      const { minX, minY, maxX, maxY } = calculateDroppableBounds(
        droppableRect,
        containerRect,
        draggableRect
      );

      const currentPos = positionRef.current;

      if (
        currentPos.x < minX ||
        currentPos.x > maxX ||
        currentPos.y < minY ||
        currentPos.y > maxY
      ) {
        requestAnimationFrame(() => {
          setPosition(initialPosition);
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, initialPosition.x, initialPosition.y, offset.x, offset.y]);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!draggableRef.current || !containerRef.current) return;

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
  };

  return (
    <>
      <h5>700px X 450px</h5>
      <div
        ref={containerRef}
        style={{
          width: "700px",
          height: "450px",
          position: "relative",
          background: "black",
          overflow: "hidden",
        }}
      >
        <div
          ref={draggableRef}
          onMouseDown={handleMouseDown}
          style={{
            width: "100px",
            height: "100px",
            zIndex: 10,
            backgroundColor: "rgba(173, 216, 230, 1)",
            cursor: "grab",
            userSelect: "none",
            position: "absolute",
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            transition: isDragging ? "none" : "transform 0.35s ease",
            pointerEvents: "all",
          }}
        />
        <div
          ref={droppableRef}
          style={{
            width: "200px",
            height: "200px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "yellow",
            userSelect: "none",
            position: "absolute",
          }}
        />
      </div>
    </>
  );
};

export default DndNativeDroppable;
