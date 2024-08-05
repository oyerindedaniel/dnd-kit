// import React, { useEffect, useRef, useState } from "react";

// interface DraggableProps {
//   children: React.ReactNode;
// }

// const Draggable: React.FC<DraggableProps> = ({ children }) => {
//   const draggableRef = useRef<HTMLDivElement>(null);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [offset, setOffset] = useState({ x: 0, y: 0 });
//   const [dragging, setDragging] = useState(false);
//   const positionRef = useRef(position);

// const handleMouseDown = (e: React.MouseEvent) => {
//   e.preventDefault();
//   if (draggableRef.current) {
//     const rect = draggableRef.current.getBoundingClientRect();
//     setOffset({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     });
//     setDragging(true);
//   }
// };

//   const handleMouseUp = () => {
//     setDragging(false);
//   };

//   const handleMouseMove = (e: MouseEvent) => {
//     if (!dragging) return;

//     // {
//     //   x: e.clientX - (draggableRef.current?.offsetWidth ?? 0) / 2,
//     //   y: e.clientY - (draggableRef.current?.offsetHeight ?? 0) / 2,
//     // };

//     const newPosition = {
//       x: e.clientX - offset.x,
//       y: e.clientY - offset.y,
//     };

//     if (draggableRef.current) {
//       const rect = draggableRef.current.getBoundingClientRect();
//       const minX = 0;
//       const minY = 0;
//       const maxX = window.innerWidth - rect.width;
//       const maxY = window.innerHeight - rect.height;

//       newPosition.x = Math.max(minX, Math.min(newPosition.x, maxX));
//       newPosition.y = Math.max(minY, Math.min(newPosition.y, maxY));
//     }

//     positionRef.current = newPosition;
// requestAnimationFrame(() => {
//   setPosition(newPosition);
// });
//   };

// useEffect(() => {
//   if (dragging) {
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   } else {
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//   }

//   return () => {
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//   };
// }, [dragging]);

//   return (
//     <div
//       ref={draggableRef}
//       onMouseDown={handleMouseDown}
//       style={{
//         position: "absolute",
// left: `${position.x}px`,
// top: `${position.y}px`,
// cursor: "grab",
// userSelect: "none",
//       }}
//     >
//       {children}
//     </div>
//   );
// };

// const DraggablePage: React.FC = () => {
//   return (
//     <div>
//       <h1>Draggable Item with requestAnimationFrame</h1>
//       <Draggable>
//         <div
//           style={{
//             padding: "16px",
//             background: "lightblue",
//             border: "1px solid black",
//           }}
//         >
//           Drag Me
//         </div>
//       </Draggable>
//     </div>
//   );
// };

// export default DraggablePage;

// import React, { useEffect, useRef, useState } from "react";

// const DraggablePage: React.FC = () => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [offset, setOffset] = useState({ x: 0, y: 0 });
//   const draggableRef = useRef<HTMLDivElement | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const handleMouseMove = (event: MouseEvent) => {
//       if (!isDragging || !draggableRef.current || !containerRef.current) return;

//       // Get container and draggable dimensions
//       const containerRect = containerRef.current.getBoundingClientRect();
//       const draggableRect = draggableRef.current.getBoundingClientRect();

//       const newPosition = {
//         x: event.clientX - offset.x,
//         y: event.clientY - offset.y,
//       };

//       // Calculate new position
//       const minX = 0;
//       const minY = 0;
//       const maxX = containerRect.width - draggableRect.width;
//       const maxY = containerRect.height - draggableRect.height;

//       // Clamp position to stay within container bounds
//       newPosition.x = Math.max(minX, Math.min(maxX, newPosition.x));
//       newPosition.y = Math.max(minY, Math.min(maxY, newPosition.y));

//       requestAnimationFrame(() => {
//         setPosition(newPosition);
//       });
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//     };

//     if (isDragging) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//     } else {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging]);

//   const handleMouseDown = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (draggableRef.current) {
//       const rect = draggableRef.current.getBoundingClientRect();
//       setOffset({
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top,
//       });
//       setIsDragging(true);
//     }
//   };

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         width: "400px",
//         height: "300px",
//         position: "relative",
//         border: "2px solid black",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         ref={draggableRef}
//         onMouseDown={handleMouseDown}
//         style={{
//           width: "100px",
//           height: "100px",
//           backgroundColor: "lightblue",
//           cursor: "grab",
//           userSelect: "none",
//           position: "absolute",
//           transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
//           transition: isDragging ? "none" : "transform 0.2s ease", // Smooth transition when not dragging
//         }}
//       />
//     </div>
//   );
// };

// export default DraggablePage;

import React, { useEffect, useRef, useState } from "react";

const DraggablePage: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const draggableRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !draggableRef.current || !containerRef.current) return;

      // Get container and draggable dimensions
      const containerRect = containerRef.current.getBoundingClientRect();
      const draggableRect = draggableRef.current.getBoundingClientRect();

      // Calculate new position
      let newX = event.clientX - containerRect.left - draggableRect.width / 2;
      let newY = event.clientY - containerRect.top - draggableRect.height / 2;

      // Clamp position to stay within container bounds
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
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
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
      <div
        ref={draggableRef}
        onMouseDown={handleMouseDown}
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: "lightblue",
          cursor: "grab",
          userSelect: "none",
          position: "absolute",
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: isDragging ? "none" : "transform 0.2s ease",
        }}
      />
    </div>
  );
};

export default DraggablePage;
