/**
 * タイトル画面の「ずかん」ボタンのラベルを生成する純関数。
 *
 * 仕様:
 * - unlocked <= 0          → "ずかん"
 * - 0 < unlocked < total   → "ずかん N / TOTAL"
 * - unlocked >= total      → "ずかん TOTAL / TOTAL 🎉"
 *
 * 子どもへ達成感を与えるため、全解放時のみお祝い絵文字を付与する。
 * 初回プレイ時 (N=0) はプレッシャーを与えないよう数字を表示しない。
 */
export function formatEncyclopediaLabel(unlocked: number, total: number): string {
  if (!Number.isFinite(unlocked) || unlocked <= 0 || total <= 0) {
    return 'ずかん';
  }
  const capped = Math.min(unlocked, total);
  if (capped >= total) {
    return `ずかん ${total} / ${total} 🎉`;
  }
  return `ずかん ${capped} / ${total}`;
}
