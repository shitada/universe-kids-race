export interface ReleaseConfirmButtonOptions {
  onActivate: () => void;
  onPressChange?: (pressed: boolean) => void;
  canActivate?: () => boolean;
  moveTolerancePx?: number;
  preventDefaultOnPointerDown?: boolean;
  preventDefaultOnClick?: boolean;
  stopPropagation?: boolean;
  documentTarget?: Document;
}

interface PointerCoordinates {
  x: number;
  y: number;
}

export function attachReleaseConfirmButton(
  button: HTMLElement,
  options: ReleaseConfirmButtonOptions,
): () => void {
  let pointerActive = false;
  let suppressNextClick = false;
  let activePointerId: number | null = null;
  let startCoordinates: PointerCoordinates | null = null;
  const documentTarget = options.documentTarget ?? document;
  const stopPropagation = options.stopPropagation ?? true;

  const callIfAllowed = (): void => {
    if (options.canActivate?.() === false) return;
    options.onActivate();
  };

  const setPressed = (pressed: boolean): void => {
    options.onPressChange?.(pressed);
  };

  const getPointerCoordinates = (event: Event): PointerCoordinates | null => {
    const pointerEvent = event as Event & {
      clientX?: unknown;
      clientY?: unknown;
    };
    return typeof pointerEvent.clientX === 'number' && typeof pointerEvent.clientY === 'number'
      ? { x: pointerEvent.clientX, y: pointerEvent.clientY }
      : null;
  };

  const getPointerId = (event: Event): number | null => {
    const pointerEvent = event as Event & { pointerId?: unknown };
    return typeof pointerEvent.pointerId === 'number' ? pointerEvent.pointerId : null;
  };

  const isActivePointerEvent = (event: Event): boolean => {
    const pointerId = getPointerId(event);
    return activePointerId === null || pointerId === null || pointerId === activePointerId;
  };

  const hasExceededMoveTolerance = (event: Event): boolean => {
    if (!pointerActive || startCoordinates === null || options.moveTolerancePx === undefined) {
      return false;
    }
    const currentCoordinates = getPointerCoordinates(event);
    if (currentCoordinates === null) {
      return false;
    }
    return Math.hypot(
      currentCoordinates.x - startCoordinates.x,
      currentCoordinates.y - startCoordinates.y,
    ) > options.moveTolerancePx;
  };

  const clearPointerState = (suppressClick: boolean): void => {
    pointerActive = false;
    suppressNextClick = suppressClick;
    activePointerId = null;
    startCoordinates = null;
    setPressed(false);
    documentTarget.removeEventListener('pointermove', handleDocumentPointerMove, true);
    documentTarget.removeEventListener('pointerup', handleDocumentPointerUp, true);
    documentTarget.removeEventListener('pointercancel', handleDocumentPointerCancel, true);
  };

  const handleDocumentPointerUp = (event: Event): void => {
    if (!pointerActive || !isActivePointerEvent(event)) {
      return;
    }
    if (hasExceededMoveTolerance(event)) {
      clearPointerState(true);
      return;
    }
    const target = event.target;
    const releasedOnButton =
      target === button || (target instanceof Node && button.contains(target));
    const shouldActivate = pointerActive && releasedOnButton;
    clearPointerState(shouldActivate || !releasedOnButton);
    if (shouldActivate) {
      callIfAllowed();
    }
  };

  const handleDocumentPointerCancel = (): void => {
    clearPointerState(true);
  };

  const handleDocumentPointerMove = (event: Event): void => {
    if (!pointerActive || !isActivePointerEvent(event)) {
      return;
    }
    if (hasExceededMoveTolerance(event)) {
      clearPointerState(true);
    }
  };

  const handlePointerDown = (event: Event): void => {
    if (options.canActivate?.() === false) return;
    if (options.preventDefaultOnPointerDown ?? false) {
      event.preventDefault();
    }
    if (stopPropagation) {
      event.stopPropagation();
    }
    pointerActive = true;
    suppressNextClick = false;
    activePointerId = getPointerId(event);
    startCoordinates = getPointerCoordinates(event);
    setPressed(true);
    if (options.moveTolerancePx !== undefined) {
      documentTarget.addEventListener('pointermove', handleDocumentPointerMove, true);
    }
    documentTarget.addEventListener('pointerup', handleDocumentPointerUp, true);
    documentTarget.addEventListener('pointercancel', handleDocumentPointerCancel, true);
  };

  const handlePointerEnter = (): void => {
    if (pointerActive) {
      setPressed(true);
    }
  };

  const handlePointerLeave = (): void => {
    if (pointerActive) {
      setPressed(false);
    }
  };

  const handlePointerCancel = (): void => {
    clearPointerState(true);
  };

  const handleClick = (event: Event): void => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    if (options.preventDefaultOnClick ?? false) {
      event.preventDefault();
    }
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    if (!pointerActive) {
      callIfAllowed();
    }
  };

  button.addEventListener('pointerdown', handlePointerDown);
  button.addEventListener('pointerenter', handlePointerEnter);
  button.addEventListener('pointerleave', handlePointerLeave);
  button.addEventListener('pointercancel', handlePointerCancel);
  button.addEventListener('click', handleClick);

  return () => {
    clearPointerState(false);
    button.removeEventListener('pointerdown', handlePointerDown);
    button.removeEventListener('pointerenter', handlePointerEnter);
    button.removeEventListener('pointerleave', handlePointerLeave);
    button.removeEventListener('pointercancel', handlePointerCancel);
    button.removeEventListener('click', handleClick);
  };
}
