export interface Rect
  extends Pick<DOMRect, "left" | "top" | "width" | "height"> {}

interface DroppableBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

// Axis-Aligned Bounding Box (AABB)

export function calculateDroppableBounds(
  droppableRect: Rect,
  containerRect: Rect,
  draggableRect: Rect
): DroppableBounds {
  const minX = droppableRect.left - containerRect.left;
  const maxX = minX + droppableRect.width - draggableRect.width;
  const minY = droppableRect.top - containerRect.top;
  const maxY = minY + droppableRect.height - draggableRect.height;

  return {
    minX: Math.round(minX),
    maxX: Math.round(maxX),
    minY: Math.round(minY),
    maxY: Math.round(maxY),
  };
}

// Point X: number; Y: number;

export type Point = [number, number];
export type RectPoints = [Point, Point, Point, Point]; // All 4 corners on a 2d plane

// distance between two points
export function euclideanDistance(point1: Point, point2: Point): number {
  return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
}

// calculates the minimum distance between corners of rect and mainRect
function rectDistance(rect: RectPoints, mainRect: RectPoints): number {
  let minDistance = Infinity;

  for (const corner of rect) {
    for (const mainCorner of mainRect) {
      const distance = euclideanDistance(corner, mainCorner);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
  }
  return minDistance;
}

// Main
export function closestRect(
  rects: RectPoints[],
  mainRect: RectPoints
): { closest: RectPoints | null; distances: number[]; minDistance: number } {
  let minDistance = Infinity;
  let closest: RectPoints | null = null;
  const distances: number[] = [];

  for (const rect of rects) {
    const distance = rectDistance(rect, mainRect);
    distances.push(distance);
    if (distance < minDistance) {
      minDistance = distance;
      closest = rect;
    }
  }
  return { closest, distances, minDistance };
}

export function getCorners(rect: Rect): RectPoints {
  const { left, top, width, height } = rect;
  return [
    [left, top],
    [left + width, top],
    [left, top + height],
    [left + width, top + height],
  ];
}

export function getCenter(corners: RectPoints): Point {
  let sumX = 0;
  let sumY = 0;

  for (const [x, y] of corners) {
    sumX += x;
    sumY += y;
  }

  const centerX = sumX / corners.length;
  const centerY = sumY / corners.length;

  return [centerX, centerY];
}

interface BoundsRect
  extends Pick<DOMRect, "left" | "top" | "right" | "bottom"> {}

export function calculateBoundsFromOrigin(
  containerRect: BoundsRect,
  DDP: BoundsRect
) {
  const minX = containerRect.left - DDP.left;
  const maxX = containerRect.right - DDP.right;

  const minY = containerRect.top - DDP.top;
  const maxY = containerRect.bottom - DDP.bottom;

  return {
    minX,
    maxX,
    minY,
    maxY,
  };
}
