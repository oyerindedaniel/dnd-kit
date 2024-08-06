interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

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
