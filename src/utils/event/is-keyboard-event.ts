import { getWindow } from "../window";

export function isKeyboardEvent(
  event: Event | undefined | null
): event is KeyboardEvent {
  if (!event) {
    return false;
  }

  const { KeyboardEvent } = getWindow(event.target);

  return KeyboardEvent && event instanceof KeyboardEvent;
}
