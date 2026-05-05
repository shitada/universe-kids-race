import { TOTAL_STAGES, getStageConfig } from '../game/config/StageConfig';
import type { GameplayStats } from '../types';
import { attachReleaseConfirmButton } from './attachReleaseConfirmButton';

function normalizeStats(stats?: GameplayStats): GameplayStats {
  return {
    totalPlayTimeSeconds: stats?.totalPlayTimeSeconds ?? 0,
    totalStarsCollected: stats?.totalStarsCollected ?? 0,
    totalBoostUses: stats?.totalBoostUses ?? 0,
    stageClearCounts: { ...(stats?.stageClearCounts ?? {}) },
  };
}

function formatPlayTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}じかん ${minutes}ふん`;
  }
  if (minutes > 0) {
    return `${minutes}ふん ${seconds}びょう`;
  }
  return `${seconds}びょう`;
}

export class StatsOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private readonly actionCleanups = new Set<() => void>();

  show(stats: GameplayStats | undefined, onClose: () => void): void {
    this.hide();

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    const normalized = normalizeStats(stats);
    const compact = window.innerHeight <= 720;

    const overlay = document.createElement('div');
    overlay.setAttribute('data-stats-overlay', '');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 35;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${compact ? '0.8rem' : '1.25rem'};
      box-sizing: border-box;
      background: rgba(0, 0, 32, 0.92);
      pointer-events: auto;
      touch-action: manipulation;
    `;
    this.overlayEl = overlay;

    const panel = document.createElement('section');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.style.cssText = `
      width: min(92vw, 640px);
      max-height: min(88vh, 760px);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 28px;
      padding: ${compact ? '1rem 0.9rem 1.2rem' : '1.5rem 1.4rem 1.6rem'};
      box-sizing: border-box;
      background: linear-gradient(180deg, rgba(15, 30, 92, 0.96), rgba(6, 12, 44, 0.98));
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3);
      color: #fff;
      text-align: center;
    `;

    const title = document.createElement('h2');
    title.textContent = 'あそびの きろく';
    title.style.cssText = `
      margin: 0 0 1rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${compact ? '1.8rem' : '2.2rem'};
      font-weight: 900;
      color: #FFE66D;
    `;
    panel.appendChild(title);

    const summaryGrid = document.createElement('div');
    summaryGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${compact ? '120px' : '150px'}, 1fr));
      gap: 0.8rem;
      margin-bottom: 1rem;
    `;
    summaryGrid.append(
      this.createSummaryCard('あそんだ じかん', formatPlayTime(normalized.totalPlayTimeSeconds), 'data-stats-total-play-time'),
      this.createSummaryCard('とった ほし', `${normalized.totalStarsCollected}こ`, 'data-stats-total-stars'),
      this.createSummaryCard('ブースト', `${normalized.totalBoostUses}かい`, 'data-stats-total-boosts'),
    );
    panel.appendChild(summaryGrid);

    const stageSection = document.createElement('div');
    stageSection.style.cssText = `
      margin-top: 0.5rem;
      padding: ${compact ? '0.9rem 0.8rem' : '1rem'};
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
    `;

    const stageTitle = document.createElement('div');
    stageTitle.textContent = 'ステージ クリア かいすう';
    stageTitle.style.cssText = `
      margin-bottom: 0.75rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${compact ? '1.1rem' : '1.25rem'};
      font-weight: 900;
      color: #FFE66D;
    `;
    stageSection.appendChild(stageTitle);

    const list = document.createElement('div');
    list.setAttribute('data-stats-stage-clears', '');
    list.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      text-align: left;
    `;

    const clearedStages = Array.from({ length: TOTAL_STAGES }, (_, index) => index + 1)
      .map((stageNumber) => ({
        stageNumber,
        clearCount: normalized.stageClearCounts[stageNumber] ?? 0,
      }))
      .filter((entry) => entry.clearCount > 0);

    if (clearedStages.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'まだ きろくが ないよ';
      empty.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${compact ? '1rem' : '1.1rem'};
        font-weight: 700;
        text-align: center;
        color: rgba(255, 255, 255, 0.88);
      `;
      list.appendChild(empty);
    } else {
      for (const { stageNumber, clearCount } of clearedStages) {
        const stageConfig = getStageConfig(stageNumber);
        const row = document.createElement('div');
        row.setAttribute('data-stats-stage-clear-row', String(stageNumber));
        row.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.55rem 0.7rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: ${compact ? '0.95rem' : '1.05rem'};
          font-weight: 700;
        `;

        const label = document.createElement('span');
        label.textContent = `${stageConfig.emoji} ステージ ${stageNumber} ${stageConfig.destinationReading}`;
        const count = document.createElement('span');
        count.textContent = `${clearCount}かい`;
        count.style.color = '#FFE66D';
        row.append(label, count);
        list.appendChild(row);
      }
    }
    stageSection.appendChild(list);
    panel.appendChild(stageSection);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'もどる';
    closeButton.style.cssText = `
      margin-top: 1rem;
      min-width: min(70vw, 220px);
      min-height: 64px;
      border: none;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${compact ? '1.2rem' : '1.35rem'};
      font-weight: 900;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `;
    this.actionCleanups.add(attachReleaseConfirmButton(closeButton, {
      onActivate: () => {
        this.hide();
        onClose();
      },
      onPressChange: (pressed) => {
        closeButton.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
      },
    }));
    panel.appendChild(closeButton);

    overlay.appendChild(panel);
    uiOverlay.appendChild(overlay);
  }

  hide(): void {
    const cleanups = Array.from(this.actionCleanups);
    this.actionCleanups.clear();
    for (const cleanup of cleanups) {
      cleanup();
    }
    this.overlayEl?.remove();
    this.overlayEl = null;
  }

  private createSummaryCard(label: string, value: string, dataAttribute: string): HTMLDivElement {
    const card = document.createElement('div');
    card.setAttribute(dataAttribute, '');
    card.style.cssText = `
      padding: 0.9rem 0.8rem;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.1);
    `;

    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    labelEl.style.cssText = `
      margin-bottom: 0.3rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.86);
    `;

    const valueEl = document.createElement('div');
    valueEl.textContent = value;
    valueEl.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.25rem, 4.4vmin, 1.8rem);
      font-weight: 900;
      color: #FFE66D;
    `;

    card.append(labelEl, valueEl);
    return card;
  }
}
