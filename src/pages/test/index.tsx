import React from "react";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function intersectionRatio(rect: Rect, collisionRect: Rect): number {
  // Determines the (x, y) coordinates of the intersection rectangle
  const xOverlap = Math.max(
    0,
    Math.min(rect.x + rect.width, collisionRect.x + collisionRect.width) -
      Math.max(rect.x, collisionRect.x)
  );
  const yOverlap = Math.max(
    0,
    Math.min(rect.y + rect.height, collisionRect.y + collisionRect.height) -
      Math.max(rect.y, collisionRect.y)
  );

  // Calculates the area of the intersection
  const intersectionArea = xOverlap * yOverlap;

  // Calculates the area of the two rectangles
  const rectArea = rect.width * rect.height;
  const collisionRectArea = collisionRect.width * collisionRect.height;

  // Intersection ratio
  const ratio = intersectionArea / Math.min(rectArea, collisionRectArea);

  return ratio;
}

// Usage Example
const rect: Rect = { x: 10, y: 10, width: 50, height: 50 };
const collisionRect: Rect = { x: 40, y: 40, width: 50, height: 50 };

const ratio = intersectionRatio(rect, collisionRect);
console.log(`Intersection Ratio: ${ratio}`);

if (ratio > 0) {
  console.log("The rectangles are intersecting.");
} else {
  console.log("The rectangles are not intersecting.");
}

const calculateOverlap = (
  rect: Rect,
  collisionRect: Rect
): { xOverlap: number; yOverlap: number } => {
  const xOverlap = Math.max(
    0,
    Math.min(rect.x + rect.width, collisionRect.x + collisionRect.width) -
      Math.max(rect.x, collisionRect.x)
  );
  const yOverlap = Math.max(
    0,
    Math.min(rect.y + rect.height, collisionRect.y + collisionRect.height) -
      Math.max(rect.y, collisionRect.y)
  );

  return { xOverlap, yOverlap };
};

const visualizeRectangles = (rect: Rect, collisionRect: Rect) => {
  const { xOverlap, yOverlap } = calculateOverlap(rect, collisionRect);
  return xOverlap * yOverlap;
};

const Rectangles: React.FC = () => {
  const rectA: Rect = { x: 10, y: 10, width: 150, height: 100 };
  const rectB: Rect = { x: 300, y: 50, width: 120, height: 80 };

  const overlapArea = visualizeRectangles(rectA, rectB);

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "400px",
          height: "400px",
          border: "1px solid black",
          backgroundColor: "#f0f0f0",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: rectA.y,
            left: rectA.x,
            width: rectA.width,
            height: rectA.height,
            backgroundColor: "rgba(255, 0, 0, 0.5)", // Red rectangle
          }}
        />
        <div
          style={{
            position: "absolute",
            top: rectB.y,
            left: rectB.x,
            width: rectB.width,
            height: rectB.height,
            backgroundColor: "rgba(0, 0, 255, 0.5)", // Blue rectangle
          }}
        />
        {overlapArea > 0 && (
          <div
            style={{
              position: "absolute",
              top: Math.max(rectA.y, rectB.y),
              left: Math.max(rectA.x, rectB.x),
              width: calculateOverlap(rectA, rectB).xOverlap,
              height: calculateOverlap(rectA, rectB).yOverlap,
              backgroundColor: "rgba(0, 255, 0, 0.5)", // Green overlap
            }}
          />
        )}
      </div>
      <p>Overlap Area: {overlapArea}</p>
    </div>
  );
};

export default Rectangles;
