import React, { useState } from "react";

interface DraggableItemProps {
  id: string;
  children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, children }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{ margin: "8px", padding: "8px", border: "1px solid black" }}
    >
      {children}
    </div>
  );
};

interface DroppableContainerProps {
  id: string;
  onDropItem: (itemId: string, parentId: string) => void;
  children: React.ReactNode;
}

const DroppableContainer: React.FC<DroppableContainerProps> = ({
  id,
  onDropItem,
  children,
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedItemId = e.dataTransfer.getData("text/plain");
    onDropItem(droppedItemId, id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        margin: "16px",
        padding: "16px",
        border: "2px dashed black",
        minHeight: "100px",
      }}
    >
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const [droppedInParent, setDroppedInParent] = useState<string | null>(null);

  const handleDropItem = (itemId: string, parentId: string) => {
    setDroppedInParent(`Item ${itemId} was dropped in ${parentId}`);
  };

  return (
    <div>
      <h1>Drag and Drop Example</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <DroppableContainer id="parent1" onDropItem={handleDropItem}>
          <p>Drop items here (Parent 1)</p>
        </DroppableContainer>
        <DroppableContainer id="parent2" onDropItem={handleDropItem}>
          <p>Drop items here (Parent 2)</p>
        </DroppableContainer>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <DraggableItem id="1">Draggable Item 1</DraggableItem>
        <DraggableItem id="2">Draggable Item 2</DraggableItem>
      </div>
      {droppedInParent && <p>{droppedInParent}</p>}
    </div>
  );
};

export default App;
