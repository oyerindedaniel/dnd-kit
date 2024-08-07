import { useRef } from "react";

// WORK ON THIS HAS I PROGRESS

const useDroppable = () => {
  const droppableRefs = useRef<HTMLDivElement[]>([]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !droppableRefs.current.includes(el)) {
      droppableRefs.current.push(el);
    }
  };

  console.log("refs", droppableRefs);

  return { addToRefs, droppableRefs };
};

export default useDroppable;
