/**
 * Resolves the initial pixel-ratio tier from a persisted value.
 *
 * Keeps the cold-start path side-effect-free so main.ts can apply the chosen
 * tier exactly once (Constitution IV: avoid an extra renderer framebuffer
 * allocation on the first frame on slow iPads).
 *
 * - `undefined` / non-number → fall back to `maxTier` (fresh install).
 * - Numeric values are floored and clamped into `[0, maxTier]`.
 */
export function resolveInitialPixelTier(
  savedTierRaw: unknown,
  maxTier: number,
): number {
  if (typeof savedTierRaw !== 'number' || !Number.isFinite(savedTierRaw)) {
    return maxTier;
  }
  return Math.max(0, Math.min(maxTier, Math.floor(savedTierRaw)));
}
