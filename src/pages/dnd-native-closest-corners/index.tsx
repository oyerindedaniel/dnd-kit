import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
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
  const [isDropped, setIsDropped] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggableRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const windowDimensionsRef = useRef<{ height: number; width: number }>({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const [closestDroppable, setClosestDroppable] = useState<string | null>(null);

  const positionRef = useRef({ x: 0, y: 0 });

  const DDP = useRef<Omit<DOMRect, "x" | "y" | "toJSON"> | null>(null);

  const { addToRefs, droppableRefs } = useDroppable();

  const DISTANCE = 75;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !draggableRef.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const draggableRect = draggableRef.current.getBoundingClientRect();

      // calculates and keeps item at original position

      // DDP -> defaultDraggablePosition
      if (!DDP.current) {
        // console.log("in here ddp current");
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
        setPosition(positionRef.current);
      });
    };

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
          const {
            width: draggableWidth,
            height: draggableHeight,
            left,
            right,
            top,
            bottom,
          } = draggableRef.current.getBoundingClientRect();
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

          const rects: { id: string; corners: RectPoints }[] = [];

          for (const element of droppableRefs.current) {
            const { left, top, width, height } =
              element.getBoundingClientRect();
            const { id } = element;

            // LEFT & TOP WITH RESPECT TO DRAGGABLE ORIGIN (0, 0)
            const corners = getCorners({
              left: minX + (left - containerLeft),
              top: minY + (top - containerTop),
              width,
              height,
            });

            rects.push({ id, corners });
          }

          const { closest, distances, minDistance } = closestRect(
            rects.map((r) => r.corners),
            mainRect
          );

          const closestDroppable = rects.find((r) => r.corners === closest);

          setClosestDroppable(closestDroppable?.id || null);

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

          setIsDropped(true);
        }
      }
    };

    const handleResize = () => {
      // const { height: prevWindowHeight, width: prevWindoeWidth } =
      //   windowDimensionsRef.current;

      // const { height: newWndowHeight, width: newWindowWidth } = {
      //   height: window.innerHeight,
      //   width: window.innerWidth,
      // };

      // windowDimensionsRef.current = ;

      if (!draggableRef.current) return;

      const draggableRect = draggableRef.current.getBoundingClientRect();
      // Reset the draggable's position and DDP on resize
      DDP.current = {
        left: draggableRect.left,
        top: draggableRect.top,
        width: draggableRect.width,
        height: draggableRect.height,
        right: draggableRect.right,
        bottom: draggableRect.bottom,
      };

      // let newX = event.clientX - offset.x - DDP.current.left;
      // let newY = event.clientY - offset.y - DDP.current.top;

      // Recalculates the initial positions

      positionRef.current = {
        x: draggableRect.left,
        y: draggableRect.top,
      };
      setPosition(positionRef.current);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    isDragging,
    initialPosition,
    offset,
    droppableRefs,
    isDropped,
    closestDroppable,
    position.x,
    position.y,
  ]);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    flushSync(() => {
      setClosestDroppable(null);
    });
    // setClosestDroppable(null);
    if (!draggableRef.current || !containerRef.current) return;
    const draggableRect = draggableRef.current.getBoundingClientRect();

    const offsetX =
      event.clientX -
      (isDropped ? draggableRect.left + position.x : draggableRect.left);
    const offsetY =
      event.clientY -
      (isDropped ? draggableRect.top + position.y : draggableRect.top);

    setInitialPosition({ x: 0, y: 0 });

    setOffset({
      x: offsetX,
      y: offsetY,
    });

    setIsDropped(false);
    setIsDragging(true);
  };

  const draggable = (
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
        zIndex: 20,
        cursor: "move",
        userSelect: "none",
        borderRadius: "4px",
        pointerEvents: "all",
        // position: "absolute",
        transform: isDragging
          ? `translate3d(${position.x}px, ${position.y}px, 0)`
          : "none",
        transition: isDragging ? "none" : "transform 0.35s ease",
      }}
    >
      <p style={{ textAlign: "center" }}>draggable</p>
    </div>
  );

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
        // ref={addToRefs}
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
          id="A1"
          ref={addToRefs}
          style={{
            width: "80%",
            height: "150px",
            backgroundColor: "#666",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            alignItems: "center",
            borderRadius: "4px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              textAlign: "center",
              position: "absolute",
            }}
          >
            useDroppable({"{id: 'A1'}"})
          </p>
          {closestDroppable === "A1" && draggable}
        </div>
        <div
          id="A2"
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
          <p
            style={{
              fontSize: "12px",
              textAlign: "center",
              position: "absolute",
            }}
          >
            useDroppable({"{id: 'A2'}"})
          </p>
          {closestDroppable === "A2" && draggable}
        </div>
        <div
          id="A3"
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
          <p
            style={{
              fontSize: "12px",
              textAlign: "center",
              position: "absolute",
            }}
          >
            useDroppable({"{id: 'A3'}"})
          </p>
          {closestDroppable === "A3" && draggable}
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
        {!closestDroppable && draggable}
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
