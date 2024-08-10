import { getWindow } from "../window";

export function isTouchEvent(
  event: Event | undefined | null
): event is TouchEvent {
  if (!event) {
    return false;
  }

  // in the window there you can get the touch event instance
  const { TouchEvent } = getWindow(event.target);

  return TouchEvent && event instanceof TouchEvent;
}
