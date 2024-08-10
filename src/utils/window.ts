/**
 * Safely retrieves the Window object associated with a DOM node.
 * @param target The event target, typically an EventTarget.
 * @returns The Window object associated with the target's document; otherwise, the global window object.
 */
export function getWindow(target: EventTarget | null): typeof window {
  const windowObj = (target as Node)?.ownerDocument?.defaultView;

  // Return the retrieved Window object if available; otherwise, return the global window object
  return windowObj || window;
}
