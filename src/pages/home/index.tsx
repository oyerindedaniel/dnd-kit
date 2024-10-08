import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
}

const Draggable: React.FC<DraggableProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  console.log(CSS.Translate.toString(transform));

  const style: React.CSSProperties = {
    // Outputs translate3d(x, y, 0)
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
};

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

const Droppable: React.FC<DroppableProps> = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const style: React.CSSProperties = {
    opacity: isOver ? 1 : 0.5,
    width: "300px",
    height: "300px",
    backgroundColor: "white",
    color: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

const Home: React.FC = () => {
  const [parent, setParent] = useState<string | number | null>(null);
  const draggable = <Draggable id="draggable">Go ahead, drag me.</Draggable>;

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    // console.log(over);
    setParent(over ? over.id : null);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {!parent ? draggable : null}
      <Droppable id="droppable">
        {parent === "droppable" ? draggable : "Drop here"}
      </Droppable>
    </DndContext>
  );
};

export default Home;
