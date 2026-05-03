import { getStageMedalStatus } from '../game/config/StageConfig';

type MedalDisplaySize = 'compact' | 'regular' | 'hero';

interface StageMedalDisplayOptions {
  label?: string;
  hint?: string;
  size?: MedalDisplaySize;
  scope?: string;
}

function getSizeStyles(size: MedalDisplaySize): {
  gap: string;
  label: string;
  medal: string;
  hint: string;
} {
  switch (size) {
    case 'hero':
      return {
        gap: '0.35rem',
        label: '0.92rem',
        medal: '1.7rem',
        hint: '0.98rem',
      };
    case 'compact':
      return {
        gap: '0.18rem',
        label: '0.7rem',
        medal: '1rem',
        hint: '0.76rem',
      };
    default:
      return {
        gap: '0.26rem',
        label: '0.8rem',
        medal: '1.25rem',
        hint: '0.84rem',
      };
  }
}

export function createStageMedalDisplay(
  stageNumber: number,
  starCount: number,
  options: StageMedalDisplayOptions = {},
): HTMLDivElement {
  const status = getStageMedalStatus(stageNumber, starCount);
  const size = options.size ?? 'regular';
  const styles = getSizeStyles(size);

  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-stage-medal-display', '');
  wrapper.setAttribute('data-stage-medal-stage', String(stageNumber));
  wrapper.setAttribute('data-stage-medal-tier', status.tier);
  wrapper.setAttribute('data-stage-medal-earned', String(status.earnedCount));
  if (options.scope) {
    wrapper.setAttribute('data-stage-medal-scope', options.scope);
  }
  wrapper.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${styles.gap};
  `;

  if (options.label) {
    const label = document.createElement('div');
    label.textContent = options.label;
    label.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${styles.label};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.84);
      letter-spacing: 0.06em;
    `;
    wrapper.appendChild(label);
  }

  const row = document.createElement('div');
  row.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${styles.gap};
  `;

  for (const slot of status.slots) {
    const medal = document.createElement('span');
    medal.setAttribute('data-stage-medal-slot', slot.tier);
    medal.setAttribute('data-stage-medal-threshold', String(slot.threshold));
    medal.setAttribute('data-stage-medal-reached', String(slot.reached));
    medal.textContent = slot.icon;
    medal.style.cssText = `
      font-size: ${styles.medal};
      line-height: 1;
      filter: ${slot.reached ? 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.45))' : 'none'};
      opacity: ${slot.reached ? '1' : '0.3'};
      transform: ${slot.reached ? 'scale(1)' : 'scale(0.92)'};
    `;
    row.appendChild(medal);
  }
  wrapper.appendChild(row);

  const hintText = options.hint ?? (status.nextThreshold === null ? 'かんぺき！' : `つぎ ⭐ ${status.nextThreshold}`);
  const hint = document.createElement('div');
  hint.setAttribute('data-stage-medal-hint', '');
  hint.textContent = hintText;
  hint.style.cssText = `
    font-family: 'Zen Maru Gothic', sans-serif;
    font-size: ${styles.hint};
    font-weight: 700;
    color: ${status.nextThreshold === null ? '#FFE66D' : 'rgba(255, 255, 255, 0.86)'};
  `;
  wrapper.appendChild(hint);

  return wrapper;
}
