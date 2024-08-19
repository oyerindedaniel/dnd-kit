// import React from "react";

// type Rect = {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// };

// export function intersectionRatio(rect: Rect, collisionRect: Rect): number {
//   // Determines the (x, y) coordinates of the intersection rectangle
//   const xOverlap = Math.max(
//     0,
//     Math.min(rect.x + rect.width, collisionRect.x + collisionRect.width) -
//       Math.max(rect.x, collisionRect.x)
//   );
//   const yOverlap = Math.max(
//     0,
//     Math.min(rect.y + rect.height, collisionRect.y + collisionRect.height) -
//       Math.max(rect.y, collisionRect.y)
//   );

//   // Calculates the area of the intersection
//   const intersectionArea = xOverlap * yOverlap;

//   // Calculates the area of the two rectangles
//   const rectArea = rect.width * rect.height;
//   const collisionRectArea = collisionRect.width * collisionRect.height;

//   // Intersection ratio
//   const ratio = intersectionArea / Math.min(rectArea, collisionRectArea);

//   return ratio;
// }

// // Usage Example
// const rect: Rect = { x: 10, y: 10, width: 50, height: 50 };
// const collisionRect: Rect = { x: 40, y: 40, width: 50, height: 50 };

// const ratio = intersectionRatio(rect, collisionRect);
// console.log(`Intersection Ratio: ${ratio}`);

// if (ratio > 0) {
//   console.log("The rectangles are intersecting.");
// } else {
//   console.log("The rectangles are not intersecting.");
// }

// const calculateOverlap = (
//   rect: Rect,
//   collisionRect: Rect
// ): { xOverlap: number; yOverlap: number } => {
//   const xOverlap = Math.max(
//     0,
//     Math.min(rect.x + rect.width, collisionRect.x + collisionRect.width) -
//       Math.max(rect.x, collisionRect.x)
//   );
//   const yOverlap = Math.max(
//     0,
//     Math.min(rect.y + rect.height, collisionRect.y + collisionRect.height) -
//       Math.max(rect.y, collisionRect.y)
//   );

//   return { xOverlap, yOverlap };
// };

// const visualizeRectangles = (rect: Rect, collisionRect: Rect) => {
//   const { xOverlap, yOverlap } = calculateOverlap(rect, collisionRect);
//   return xOverlap * yOverlap;
// };

// const Rectangles: React.FC = () => {
//   const rectA: Rect = { x: 10, y: 10, width: 150, height: 100 };
//   const rectB: Rect = { x: 300, y: 50, width: 120, height: 80 };

//   const overlapArea = visualizeRectangles(rectA, rectB);

//   return (
//     <div>
//       <div
//         style={{
//           position: "relative",
//           width: "400px",
//           height: "400px",
//           border: "1px solid black",
//           backgroundColor: "#f0f0f0",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             top: rectA.y,
//             left: rectA.x,
//             width: rectA.width,
//             height: rectA.height,
//             backgroundColor: "rgba(255, 0, 0, 0.5)", // Red rectangle
//           }}
//         />
//         <div
//           style={{
//             position: "absolute",
//             top: rectB.y,
//             left: rectB.x,
//             width: rectB.width,
//             height: rectB.height,
//             backgroundColor: "rgba(0, 0, 255, 0.5)", // Blue rectangle
//           }}
//         />
//         {overlapArea > 0 && (
//           <div
//             style={{
//               position: "absolute",
//               top: Math.max(rectA.y, rectB.y),
//               left: Math.max(rectA.x, rectB.x),
//               width: calculateOverlap(rectA, rectB).xOverlap,
//               height: calculateOverlap(rectA, rectB).yOverlap,
//               backgroundColor: "rgba(0, 255, 0, 0.5)", // Green overlap
//             }}
//           />
//         )}
//       </div>
//       <p>Overlap Area: {overlapArea}</p>
//     </div>
//   );
// };

// export default Rectangles;

// import { canUseDOM } from "@dnd-kit/utilities";

// function isDocumentScrollingElement(element: Element | null) {
//   if (!canUseDOM || !element) {
//     return false;
//   }

//   return element === document.scrollingElement;
// }

// function getScrollPosition(scrollingContainer: Element) {
//   const minScroll = {
//     x: 0,
//     y: 0,
//   };
//   const dimensions = isDocumentScrollingElement(scrollingContainer)
//     ? {
//         height: window.innerHeight,
//         width: window.innerWidth,
//       }
//     : {
//         height: scrollingContainer.clientHeight,
//         width: scrollingContainer.clientWidth,
//       };
//   const maxScroll = {
//     x: scrollingContainer.scrollWidth - dimensions.width,
//     y: scrollingContainer.scrollHeight - dimensions.height,
//   };
//   console.log(scrollingContainer.scrollTop);
//   console.log("maxscrooo", maxScroll);

//   const isTop = scrollingContainer.scrollTop <= minScroll.y;
//   const isLeft = scrollingContainer.scrollLeft <= minScroll.x;
//   const isBottom = scrollingContainer.scrollTop >= maxScroll.y;
//   const isRight = scrollingContainer.scrollLeft >= maxScroll.x;

//   return {
//     isTop,
//     isLeft,
//     isBottom,
//     isRight,
//     maxScroll,
//     minScroll,
//   };
// }

// import React, { useEffect, useRef, useState } from "react";

// const ScrollComponent: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [scrollInfo, setScrollInfo] = useState({
//     isTop: true,
//     isLeft: true,
//     isBottom: false,
//     isRight: false,
//     maxScroll: { x: 0, y: 0 },
//     minScroll: { x: 0, y: 0 },
//   });

//   const handleScroll = () => {
//     if (containerRef.current) {
//       const position = getScrollPosition(containerRef.current);
//       setScrollInfo(position);
//     }
//   };

//   useEffect(() => {
//     const container = containerRef.current;
//     if (container) {
//       container.addEventListener("scroll", handleScroll);
//       return () => {
//         container.removeEventListener("scroll", handleScroll);
//       };
//     }
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         height: "300px",
//         width: "400px",
//         overflow: "auto",
//         background: "red",
//       }}
//     >
//       <div style={{ height: "1000px", width: "1000px" }}>
//         {/* Content goes here */}
//       </div>
//       {scrollInfo.isBottom && <div>You have reached the bottom!</div>}
//       {scrollInfo.isTop && <div>You are at the top!</div>}
//     </div>
//   );
// };

// export default ScrollComponent;

// type Daniel<T extends object, K extends keyof T> = Pick<T, K>;

// import { useEffect, useLayoutEffect, useRef } from "react";

// export const useIsomorphicLayoutEffect =
//   typeof window !== "undefined" ? useLayoutEffect : useEffect;

// export function useLatestValue<T>(value: T) {
//   const valueRef = useRef<T>(value);

//   useIsomorphicLayoutEffect(() => {
//     valueRef.current = value;
//   }, [value]);

//   return valueRef;
// }

// import { useState } from "react";

// // Assuming useLatestValue and useIsomorphicLayoutEffect are implemented as above

// function TimerComponent() {
//   const [interval, setInterval] = useState(1000);
//   const latestInterval = useLatestValue(interval);

//   useEffect(() => {
//     console.log(interval);

//     return () => {
//       console.log("cleared");
//       // clearInterval(timer);
//     };
//   }, [interval]);

//   return (
//     <div>
//       <label>
//         Interval (ms):
//         <input
//           type="number"
//           value={interval}
//           onChange={(e) => setInterval(Number(e.target.value))}
//         />
//       </label>
//     </div>
//   );
// }

// export default TimerComponent;

// import React, { useCallback, useRef } from "react";

// interface DropAnimationConfig {
//   keyframes: () => Keyframe[];
//   duration?: number;
//   easing?: string;
// }

// function useDropAnimation(config: DropAnimationConfig) {
//   return useCallback(
//     (node: HTMLElement | null) => {
//       if (!config || !node) return;

//       const animation = node.animate(config.keyframes(), {
//         duration: config.duration || 250,
//         easing: config.easing || "ease",
//         fill: "forwards",
//       });

//       return new Promise<string>((resolve) => {
//         animation.onfinish = () => {
//           resolve("animation completed");
//         };
//       });
//     },
//     [config]
//   );
// }

// const DropAnimationDemo: React.FC = () => {
//   const draggableRef = useRef<HTMLDivElement>(null);
//   const droppableRef = useRef<HTMLDivElement>(null);

//   const animateDrop = useDropAnimation({
//     keyframes: () => [
//       { transform: "translateX(0px)" },
//       { transform: "translateX(200px)" },
//     ],
//     duration: 500,
//     easing: "ease-out",
//   });

//   const handleDrag = async () => {
//     if (draggableRef.current) {
//       const isCompleted = await animateDrop(draggableRef.current);
//       console.log(isCompleted);
//     }
//   };

//   return (
//     <div style={{ position: "relative", height: "200px" }}>
//       <div
//         ref={draggableRef}
//         style={{
//           width: "100px",
//           height: "100px",
//           backgroundColor: "red",
//           position: "absolute",
//           transition: "transform 0.5s ease-out",
//         }}
//       >
//         Draggable
//       </div>
//       <div
//         ref={droppableRef}
//         style={{
//           width: "100px",
//           height: "100px",
//           backgroundColor: "blue",
//           position: "absolute",
//           left: "300px",
//         }}
//       >
//         Droppable
//       </div>
//       <button onClick={handleDrag} style={{ marginTop: "150px" }}>
//         Trigger Animation
//       </button>
//     </div>
//   );
// };

// export default DropAnimationDemo;

import React, {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type Animation = (
  id: string,
  element: HTMLElement
) => Promise<void> | void;

export interface Props {
  animation: Animation;
  children: React.ReactElement | null;
}

export function AnimationManager({ animation, children }: Props) {
  const [clonedChildren, setClonedChildren] =
    useState<React.ReactElement | null>(null);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const previousChildren = usePrevious(children);

  useEffect(() => {
    if (!children && !clonedChildren && previousChildren) {
      setClonedChildren(previousChildren);
    }
  }, [children, clonedChildren, previousChildren]);

  useEffect(() => {
    if (!element) return;

    const key = clonedChildren?.key;
    const id = clonedChildren?.props.id;

    if (id == null) {
      setClonedChildren(null);
      return;
    }

    Promise.resolve(animation(id, element)).then(() => {
      setClonedChildren(null);
    });
  }, [animation, clonedChildren, element]);

  return (
    <>
      {children}
      {clonedChildren
        ? cloneElement(clonedChildren, { ref: setElement })
        : null}
    </>
  );
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface DropAnimationConfig {
  keyframes: () => Keyframe[];
  duration?: number;
  easing?: string;
}

const AnimationDemo = () => {
  const [show, setShow] = useState(true);

  const handleRemove = () => {
    setShow(false);
  };

  function useAnimation(config: DropAnimationConfig) {
    return useCallback(
      (id: string, node: HTMLElement | null) => {
        if (!config || !node) return;

        const animation = node.animate(config.keyframes(), {
          duration: config.duration || 250,
          easing: config.easing || "ease",
          fill: "forwards",
        });

        return new Promise<void>((resolve) => {
          animation.onfinish = () => {
            resolve();
          };
        });
      },
      [config]
    );
  }

  const animation = useAnimation({
    keyframes: () => [
      { opacity: 1, transform: "translateX(0)" },
      { opacity: 0, transform: "translateX(100px)" },
    ],
    duration: 500,
    easing: "ease-out",
  });

  // const animation: Animation = (id, element) => {
  //   return animateDrop(element);
  // };

  return (
    <div>
      <button onClick={handleRemove}>Remove Element</button>
      <AnimationManager animation={animation}>
        {show ? <div id="my-element">This will fade out</div> : null}
      </AnimationManager>
    </div>
  );
};

export default AnimationDemo;
