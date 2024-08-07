import React, { useEffect, useRef, useState } from "react";
import useDroppable from "../../hooks/use-droppable";
import {
  calculateBoundsFromOrigin,
  closestRect,
  getCorners,
  type RectPoints,
} from "../../utils";

// CONCEPT OF CLOSEST CORNERS COLLISION ALGORITHM
const DndNativeCorners: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggableRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const positionRef = useRef({ x: 0, y: 0 });

  const DDP = useRef<Omit<DOMRect, "x" | "y" | "toJSON"> | null>(null);

  const { addToRefs, droppableRefs } = useDroppable();

  const DISTANCE = 75;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !draggableRef.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const draggableRect = draggableRef.current.getBoundingClientRect();

      // calculates and keep item at original position

      // DDP -> defaultDraggablePosition
      if (!DDP.current) {
        DDP.current = {
          left: draggableRect.left,
          top: draggableRect.top,
          width: draggableRect.width,
          height: draggableRect.height,
          right: draggableRect.right,
          bottom: draggableRect.bottom,
        };
      }

      let newX = event.clientX - offset.x - DDP.current.left;
      let newY = event.clientY - offset.y - DDP.current.top;

      const minX = containerRect.left - DDP.current.left;
      const maxX = containerRect.right - DDP.current.right;

      const minY = containerRect.top - DDP.current.top;
      const maxY = containerRect.bottom - DDP.current.bottom;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      positionRef.current = {
        x: newX,
        y: newY,
      };

      requestAnimationFrame(() => {
        setPosition({
          x: newX,
          y: newY,
        });
      });
    };

    // FOR NOW
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (
          droppableRefs.current.length &&
          containerRef.current &&
          draggableRef.current &&
          DDP.current
        ) {
          const draggablePosition = positionRef.current;
          const {
            left: containerLeft,
            top: containerTop,
            bottom: containerBottom,
            right: containerRight,
          } = containerRef.current.getBoundingClientRect();
          const { width: draggableWidth, height: draggableHeight } =
            draggableRef.current.getBoundingClientRect();
          const {
            left: DDPLeft,
            top: DDPTop,
            bottom: DDPBottom,
            right: DDPRight,
          } = DDP.current;

          const { minX, minY } = calculateBoundsFromOrigin(
            {
              left: containerLeft,
              top: containerTop,
              bottom: containerBottom,
              right: containerRight,
            },
            {
              left: DDPLeft,
              top: DDPTop,
              bottom: DDPBottom,
              right: DDPRight,
            }
          );

          const mainRect = getCorners({
            left: draggablePosition.x,
            top: draggablePosition.y,
            width: draggableWidth,
            height: draggableHeight,
          });
          const rects: RectPoints[] = [];

          for (const ref of droppableRefs.current) {
            const { left, top, width, height } = ref.getBoundingClientRect();

            // LEFT & TOP WITH RESPECT TO DRAGGABLE ORGIN (0, 0)
            const corners = getCorners({
              left: minX + (left - containerLeft),
              top: minY + (top - containerTop),
              width,
              height,
            });

            rects.push(corners);
          }

          const { distances, closest, minDistance } = closestRect(
            rects,
            mainRect
          );

          const [[x, y]] = closest!;

          if (minDistance) {
            requestAnimationFrame(() => {
              setPosition({ x, y });
            });
          } else {
            requestAnimationFrame(() => {
              setPosition(initialPosition);
            });
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
  }, [isDragging, initialPosition, offset, droppableRefs]);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (draggableRef.current) {
      const draggableRect = draggableRef.current.getBoundingClientRect();

      const offsetX = event.clientX - draggableRect.left;
      const offsetY = event.clientY - draggableRect.top;

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
        display: "flex",
        justifyContent: "space-between",
        gap: "32px",
        backgroundColor: "#333",
        height: "100vh",
        color: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#444",
          padding: "20px",
          borderRadius: "8px",
          position: "relative",
          width: "300px",
        }}
      >
        <div
          ref={addToRefs}
          style={{
            width: "80%",
            height: "150px",
            backgroundColor: "#666",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "4px",
          }}
        >
          <p style={{ textAlign: "center" }}>useDroppable({"{id: 'A1'}"})</p>
        </div>
        <div
          ref={addToRefs}
          style={{
            width: "80%",
            height: "150px",
            backgroundColor: "#666",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "4px",
          }}
        >
          <p style={{ textAlign: "center" }}>useDroppable({"{id: 'A2'}"})</p>
        </div>
        <div
          ref={addToRefs}
          style={{
            width: "80%",
            height: "150px",
            backgroundColor: "#666",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "4px",
          }}
        >
          <p style={{ textAlign: "center" }}>useDroppable({"{id: 'A3'}"})</p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#444",
          width: "300px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        <div
          ref={draggableRef}
          onMouseDown={handleMouseDown}
          style={{
            width: "80%",
            height: "80px",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            color: "black",
            alignItems: "center",
            cursor: "move",
            userSelect: "none",
            borderRadius: "4px",
            pointerEvents: "all",
            // position: "absolute",
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            transition: isDragging ? "none" : "transform 0.35s ease",
          }}
        >
          <p style={{ textAlign: "center" }}>draggable</p>
        </div>
      </div>

      {/* <div
        style={{
          width: "150px",
          height: "50px",
          backgroundColor: "#888",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "move",
          borderRadius: "8px",
        }}
      >
        <p style={{ textAlign: "center" }}>draggable</p>
      </div> */}
    </div>
  );
};

export default DndNativeCorners;
