import React, { useEffect, useRef, useState } from "react";

interface DraggableProps {
  children: React.ReactNode;
}

const Draggable: React.FC<DraggableProps> = ({ children }) => {
  const draggableRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const positionRef = useRef(position);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (draggableRef.current) {
      const rect = draggableRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setDragging(true);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    const newPosition = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };

    if (draggableRef.current) {
      const rect = draggableRef.current.getBoundingClientRect();
      const minX = 0;
      const minY = 0;
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;

      newPosition.x = Math.max(minX, Math.min(newPosition.x, maxX));
      newPosition.y = Math.max(minY, Math.min(newPosition.y, maxY));
    }

    positionRef.current = newPosition;
    requestAnimationFrame(() => {
      setPosition(newPosition);
    });
  };

  useEffect(() => {
    if (dragging) {
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
  }, [dragging]);

  return (
    <div
      ref={draggableRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: "grab",
        userSelect: "none",
      }}
    >
      {children}
    </div>
  );
};

const DraggablePage: React.FC = () => {
  return (
    <div>
      <h1>Draggable Item with requestAnimationFrame</h1>
      <Draggable>
        <div
          style={{
            padding: "16px",
            background: "lightblue",
            border: "1px solid black",
          }}
        >
          Drag Me
        </div>
      </Draggable>
    </div>
  );
};

export default DraggablePage;
