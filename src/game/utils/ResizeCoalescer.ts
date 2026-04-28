export type ResizeApply = (width: number, height: number) => void;

export interface ResizeCoalescer {
  schedule(width: number, height: number): void;
  flush(): void;
  dispose(): void;
}

type RafFn = (cb: FrameRequestCallback) => number;
type CafFn = (handle: number) => void;

export function createResizeCoalescer(
  apply: ResizeApply,
  raf: RafFn = requestAnimationFrame,
  caf: CafFn = cancelAnimationFrame,
): ResizeCoalescer {
  let pendingW: number | null = null;
  let pendingH: number | null = null;
  let lastAppliedW: number | null = null;
  let lastAppliedH: number | null = null;
  let rafHandle: number | null = null;
  let disposed = false;

  function run(): void {
    rafHandle = null;
    if (disposed || pendingW === null || pendingH === null) return;
    const w = pendingW;
    const h = pendingH;
    pendingW = null;
    pendingH = null;
    if (w === lastAppliedW && h === lastAppliedH) return;
    lastAppliedW = w;
    lastAppliedH = h;
    apply(w, h);
  }

  return {
    schedule(width: number, height: number): void {
      if (disposed) return;
      pendingW = width;
      pendingH = height;
      if (rafHandle === null) {
        rafHandle = raf(run);
      }
    },
    flush(): void {
      if (disposed) return;
      if (rafHandle !== null) {
        caf(rafHandle);
        rafHandle = null;
      }
      run();
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      if (rafHandle !== null) {
        caf(rafHandle);
        rafHandle = null;
      }
      pendingW = null;
      pendingH = null;
    },
  };
}
