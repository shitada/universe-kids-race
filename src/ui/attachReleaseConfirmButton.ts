export interface ReleaseConfirmButtonOptions {
  onActivate: () => void;
  onPressChange?: (pressed: boolean) => void;
  canActivate?: () => boolean;
  preventDefaultOnPointerDown?: boolean;
  preventDefaultOnClick?: boolean;
  stopPropagation?: boolean;
  documentTarget?: Document;
}

export function attachReleaseConfirmButton(
  button: HTMLButtonElement,
  options: ReleaseConfirmButtonOptions,
): () => void {
  let pointerActive = false;
  let suppressNextClick = false;
  const documentTarget = options.documentTarget ?? document;
  const stopPropagation = options.stopPropagation ?? true;

  const callIfAllowed = (): void => {
    if (options.canActivate?.() === false) return;
    options.onActivate();
  };

  const setPressed = (pressed: boolean): void => {
    options.onPressChange?.(pressed);
  };

  const clearPointerState = (suppressClick: boolean): void => {
    pointerActive = false;
    suppressNextClick = suppressClick;
    setPressed(false);
    documentTarget.removeEventListener('pointerup', handleDocumentPointerUp, true);
    documentTarget.removeEventListener('pointercancel', handleDocumentPointerCancel, true);
  };

  const handleDocumentPointerUp = (event: Event): void => {
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
    setPressed(true);
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
