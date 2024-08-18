import { useMemo } from "react";

export function useCombinedRefs<T>(
  ...refs: ((node: T) => void)[]
): (node: T) => void {
  return useMemo(
    () => (node: T) => {
      refs.forEach((ref) => ref(node));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}

// function useCombinedRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
//   return useMemo(
//     () => (node: T) => {
//       refs.forEach((ref) => {
//         if (typeof ref === "function") {
//           ref(node);
//         } else if (ref && typeof ref === "object") {
//           (ref as React.MutableRefObject<T | null>).current = node;
//         }
//       });
//     },
//     refs
//   );
// }

// const App = () => {
//   const objectRef = useRef<HTMLInputElement>(null);

//   const callbackRef = (node: HTMLInputElement | null) => {
//     if (node) {
//       console.log("Callback ref called: Input mounted");
//     }
//   };

//   // Combine both the object ref and the callback ref
//   const combinedRef = useCombinedRefs(objectRef, callbackRef);

//   useEffect(() => {
//     if (objectRef.current) {
//       // Directly interact with the DOM element using the object ref
//       console.log("Object ref value:", objectRef.current.value);
//     }
//   }, []);

//   return (
//     <div>
//       <input ref={combinedRef} placeholder="Type something..." />
//       <button
//         onClick={() => console.log("Current value:", objectRef.current?.value)}
//       >
//         Log Input Value
//       </button>
//     </div>
//   );
// };

// export default App;
