import type {
  ColorVisionSupportMode,
  ConstellationDefinition,
  MonthlyEncounterId,
  PlanetEncyclopediaEntry,
  SpaceGemType,
} from '../types';
import {
  DEFAULT_COLOR_VISION_SUPPORT_MODE,
  formatPlanetEncyclopediaLabel,
  getPlanetEncyclopediaEntry,
  PLANET_ENCYCLOPEDIA,
} from '../game/config/PlanetEncyclopedia';
import { CONSTELLATION_DATA, getConstellationForStage } from '../game/config/ConstellationData';
import { MONTHLY_ENCOUNTER_CONFIG } from '../game/config/MonthlyEncounterConfig';
import { SPACE_GEM_ENCYCLOPEDIA } from '../game/config/SpaceGemConfig';
import { createCompanionPreviewController, type CompanionPreviewController } from './CompanionPreview';
import { attachReleaseConfirmButton } from './attachReleaseConfirmButton';
import { createStageMedalDisplay } from './stageMedalDisplay';

interface DetailOverlayOptions {
  bestStageStars?: Record<number, number>;
  backLabel?: string;
  colorVisionSupportMode?: ColorVisionSupportMode;
  zIndex?: number;
  discoveredConstellations?: number[];
}

interface EncyclopediaOverlayDependencies {
  createPreviewController?: () => CompanionPreviewController;
}

export class EncyclopediaOverlay {
  private static readonly RELEASE_CONFIRM_MOVE_TOLERANCE_PX = 12;
  private static readonly GALLERY_TITLE_ID = 'encyclopedia-gallery-title';
  private static readonly DETAIL_TITLE_ID = 'encyclopedia-detail-title';
  private static readonly PLANET_TAB_LABEL = 'わくせいずかん';
  private static readonly MONTHLY_TAB_LABEL = 'てんたいずかん';
  private static readonly GEM_TAB_LABEL = 'たからばこ';
  private overlayEl: HTMLDivElement | null = null;
  private detailEl: HTMLDivElement | null = null;
  private galleryTitleEl: HTMLDivElement | null = null;
  private galleryPanels = new Map<'planets' | 'monthly' | 'gems', HTMLDivElement>();
  private activeTab: 'planets' | 'monthly' | 'gems' = 'planets';
  private isShowingDetail = false;
  private onSelectStage: ((stageNumber: number) => void) | null = null;
  private bestStageStars: Record<number, number> = {};
  private discoveredConstellations: number[] = [];
  private discoveredMonthlyEncounters: MonthlyEncounterId[] = [];
  private discoveredSpaceGems: SpaceGemType[] = [];
  private colorVisionSupportMode: ColorVisionSupportMode = DEFAULT_COLOR_VISION_SUPPORT_MODE;
  private detailBackLabel = 'もどる';
  private detailPreviewController: CompanionPreviewController | null = null;
  private readonly createPreviewController: () => CompanionPreviewController;
  private readonly galleryActionCleanups = new Set<() => void>();
  private readonly detailActionCleanups = new Set<() => void>();
  private static readonly COMPACT_HEIGHT_THRESHOLD = 768;

  constructor(dependencies: EncyclopediaOverlayDependencies = {}) {
    this.createPreviewController = dependencies.createPreviewController ?? createCompanionPreviewController;
  }

  show(
    unlockedPlanets: number[],
    onClose: () => void,
    onSelectStage?: (stageNumber: number) => void,
    bestStageStars?: Record<number, number>,
    discoveredConstellations: number[] = [],
    colorVisionSupportMode: ColorVisionSupportMode = DEFAULT_COLOR_VISION_SUPPORT_MODE,
    discoveredMonthlyEncounters: MonthlyEncounterId[] = [],
    discoveredSpaceGems: SpaceGemType[] = [],
  ): void {
    if (this.overlayEl) return;
    this.onSelectStage = onSelectStage ?? null;
    this.bestStageStars = bestStageStars ?? {};
    this.discoveredConstellations = discoveredConstellations;
    this.colorVisionSupportMode = colorVisionSupportMode;
    this.discoveredMonthlyEncounters = discoveredMonthlyEncounters;
    this.discoveredSpaceGems = discoveredSpaceGems;
    this.detailBackLabel = 'もどる';
    this.activeTab = 'planets';
    this.galleryPanels.clear();

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.overlayEl = document.createElement('div');
    this.applyOverlayStyle(this.overlayEl, 30);
    this.overlayEl.setAttribute('role', 'dialog');
    this.overlayEl.setAttribute('aria-modal', 'true');
    this.overlayEl.setAttribute('aria-labelledby', EncyclopediaOverlay.GALLERY_TITLE_ID);
    const isCompactHeight = this.isCompactHeight();

    const content = document.createElement('div');
    content.setAttribute('data-gallery-content', '');
    content.style.cssText = `
      width: min(960px, 100%);
      height: 100%;
      max-height: 720px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: ${isCompactHeight ? '0.45rem 0.35rem' : '0.5rem'};
      box-sizing: border-box;
    `;

    // Title
    const title = document.createElement('div');
    title.id = EncyclopediaOverlay.GALLERY_TITLE_ID;
    title.textContent = EncyclopediaOverlay.PLANET_TAB_LABEL;
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1.7rem' : '2rem'};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${isCompactHeight ? '0.45rem' : '0.8rem'};
      text-align: center;
    `;
    this.galleryTitleEl = title;
    content.appendChild(title);

    content.appendChild(this.createTabBar(isCompactHeight));

    const galleryMain = document.createElement('div');
    galleryMain.setAttribute('data-gallery-main', '');
    galleryMain.style.cssText = `
      position: relative;
      width: min(100%, 900px);
      min-height: 0;
      flex: 1 1 auto;
      display: grid;
      align-items: stretch;
      justify-content: center;
    `;

    const planetPanel = this.createPlanetPanel(unlockedPlanets, isCompactHeight);
    const monthlyPanel = this.createMonthlyPanel(isCompactHeight);
    const gemPanel = this.createGemPanel(isCompactHeight);
    this.galleryPanels.set('planets', planetPanel);
    this.galleryPanels.set('monthly', monthlyPanel);
    this.galleryPanels.set('gems', gemPanel);
    galleryMain.appendChild(planetPanel);
    galleryMain.appendChild(monthlyPanel);
    galleryMain.appendChild(gemPanel);
    this.setActiveTab('planets');
    content.appendChild(galleryMain);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.setAttribute('data-gallery-back', '');
    backBtn.textContent = 'もどる';
    backBtn.style.cssText = `
      margin-top: ${isCompactHeight ? '0.55rem' : '0.8rem'};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1.05rem' : '1.25rem'};
      font-weight: 700;
      padding: ${isCompactHeight ? '0.45rem 1.45rem' : '0.55rem 1.8rem'};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `;
    this.galleryActionCleanups.add(attachReleaseConfirmButton(backBtn, {
      onActivate: () => {
        this.hide();
        onClose();
      },
      onPressChange: (pressed) => {
        backBtn.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
      },
      moveTolerancePx: EncyclopediaOverlay.RELEASE_CONFIRM_MOVE_TOLERANCE_PX,
    }));
    content.appendChild(backBtn);

    this.overlayEl.appendChild(content);
    uiOverlay.appendChild(this.overlayEl);
  }

  showStageDetail(stageNumber: number, onClose: () => void, options: DetailOverlayOptions = {}): boolean {
    if (this.overlayEl) return false;
    const entry = getPlanetEncyclopediaEntry(stageNumber);
    if (!entry) return false;

    this.onSelectStage = null;
    this.bestStageStars = options.bestStageStars ?? {};
    this.discoveredConstellations = options.discoveredConstellations ?? [];
    this.colorVisionSupportMode = options.colorVisionSupportMode ?? DEFAULT_COLOR_VISION_SUPPORT_MODE;
    this.detailBackLabel = options.backLabel ?? 'もどる';

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return false;

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-encyclopedia-detail-overlay', '');
    this.applyOverlayStyle(this.overlayEl, options.zIndex ?? 30);
    this.overlayEl.setAttribute('role', 'dialog');
    this.overlayEl.setAttribute('aria-modal', 'true');
    this.overlayEl.setAttribute('aria-labelledby', EncyclopediaOverlay.DETAIL_TITLE_ID);
    uiOverlay.appendChild(this.overlayEl);
    this.showDetail(entry, onClose);
    return true;
  }

  private applyOverlayStyle(element: HTMLDivElement, zIndex: number): void {
    element.style.cssText = `
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 32, 0.95);
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: ${this.isCompactHeight() ? '0.5rem' : '0.9rem'};
      box-sizing: border-box;
      overflow: hidden;
    `;
    element.style.zIndex = String(zIndex);
  }

  hide(): void {
    this.cleanupActionCleanups(this.detailActionCleanups);
    this.cleanupActionCleanups(this.galleryActionCleanups);
    this.hideDetailPreview();
    if (this.detailEl) {
      this.detailEl.remove();
      this.detailEl = null;
    }
    if (this.overlayEl) {
      this.overlayEl.remove();
      this.overlayEl = null;
    }
    this.isShowingDetail = false;
    this.onSelectStage = null;
    this.bestStageStars = {};
    this.discoveredConstellations = [];
    this.discoveredMonthlyEncounters = [];
    this.discoveredSpaceGems = [];
    this.colorVisionSupportMode = DEFAULT_COLOR_VISION_SUPPORT_MODE;
    this.detailBackLabel = 'もどる';
    this.galleryTitleEl = null;
    this.galleryPanels.clear();
    this.activeTab = 'planets';
    this.disposeDetailPreview();
  }

  private createTabBar(isCompactHeight: boolean): HTMLDivElement {
    const tabBar = document.createElement('div');
    tabBar.style.cssText = `
      display: flex;
      gap: 0.45rem;
      margin-bottom: ${isCompactHeight ? '0.4rem' : '0.55rem'};
    `;
    tabBar.appendChild(this.createTabButton('planets', 'わくせい', isCompactHeight));
    tabBar.appendChild(this.createTabButton('monthly', 'てんたい', isCompactHeight));
    tabBar.appendChild(this.createTabButton('gems', 'たから', isCompactHeight));
    return tabBar;
  }

  private createTabButton(tab: 'planets' | 'monthly' | 'gems', label: string, isCompactHeight: boolean): HTMLButtonElement {
    const button = document.createElement('button');
    button.setAttribute('data-encyclopedia-tab', tab);
    button.textContent = label;
    button.style.cssText = `
      min-width: ${isCompactHeight ? '7.4rem' : '8.4rem'};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '0.95rem' : '1.05rem'};
      font-weight: 800;
      padding: ${isCompactHeight ? '0.42rem 0.9rem' : '0.5rem 1rem'};
      border: none;
      border-radius: 999px;
      color: #fff;
      background: rgba(255, 255, 255, 0.12);
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out, background 0.12s ease-out;
    `;
    this.galleryActionCleanups.add(attachReleaseConfirmButton(button, {
      onActivate: () => {
        this.setActiveTab(tab);
      },
      onPressChange: (pressed) => {
        button.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
      },
      moveTolerancePx: EncyclopediaOverlay.RELEASE_CONFIRM_MOVE_TOLERANCE_PX,
    }));
    return button;
  }

  private setActiveTab(tab: 'planets' | 'monthly' | 'gems'): void {
    this.activeTab = tab;
    if (this.galleryTitleEl) {
      this.galleryTitleEl.textContent = tab === 'monthly'
        ? EncyclopediaOverlay.MONTHLY_TAB_LABEL
        : tab === 'gems'
          ? EncyclopediaOverlay.GEM_TAB_LABEL
          : EncyclopediaOverlay.PLANET_TAB_LABEL;
    }
    for (const [panelTab, panel] of this.galleryPanels) {
      const isActive = panelTab === tab;
      panel.style.display = isActive ? 'grid' : 'none';
      panel.setAttribute('data-active', isActive ? 'true' : 'false');
    }
    const tabButtons = this.overlayEl?.querySelectorAll<HTMLElement>('[data-encyclopedia-tab]') ?? [];
    tabButtons.forEach((button) => {
      const isActive = button.getAttribute('data-encyclopedia-tab') === tab;
      button.style.background = isActive ? 'linear-gradient(135deg, rgba(255, 215, 112, 0.9), rgba(123, 199, 255, 0.85))' : 'rgba(255, 255, 255, 0.12)';
      button.style.color = isActive ? '#18233b' : '#fff';
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  private createPlanetPanel(unlockedPlanets: number[], isCompactHeight: boolean): HTMLDivElement {
    const galleryMain = document.createElement('div');
    galleryMain.setAttribute('data-encyclopedia-panel', 'planets');
    galleryMain.style.cssText = `
      display: grid;
      grid-area: 1 / 1;
      grid-template-columns: minmax(0, 1fr) minmax(12rem, 0.34fr);
      gap: ${isCompactHeight ? '0.55rem' : '0.8rem'};
      width: 100%;
      align-items: stretch;
      min-height: 0;
    `;

    const grid = document.createElement('div');
    grid.setAttribute('data-gallery-grid', '');
    grid.setAttribute('aria-label', 'わくせい の いちらん');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${isCompactHeight ? '86px' : '110px'}, 1fr));
      gap: ${isCompactHeight ? '0.45rem' : '0.65rem'};
      width: 100%;
      justify-items: center;
      align-items: stretch;
    `;

    for (const entry of PLANET_ENCYCLOPEDIA) {
      const isUnlocked = unlockedPlanets.includes(entry.stageNumber);
      const card = this.createCard(entry, isUnlocked, isCompactHeight);
      grid.appendChild(card);
    }

    galleryMain.appendChild(grid);
    galleryMain.appendChild(this.createConstellationSection(isCompactHeight));
    return galleryMain;
  }

  private createMonthlyPanel(isCompactHeight: boolean): HTMLDivElement {
    const panel = document.createElement('div');
    panel.setAttribute('data-encyclopedia-panel', 'monthly');
    panel.style.cssText = `
      display: none;
      grid-area: 1 / 1;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: ${isCompactHeight ? '0.45rem' : '0.6rem'};
      width: 100%;
      align-content: start;
    `;

    for (const entry of MONTHLY_ENCOUNTER_CONFIG) {
      const discovered = this.discoveredMonthlyEncounters.includes(entry.id);
      const card = document.createElement('div');
      card.setAttribute('data-monthly-encounter-card', '');
      card.setAttribute('data-monthly-encounter-id', entry.id);
      card.style.cssText = `
        min-height: ${isCompactHeight ? '96px' : '116px'};
        border-radius: 18px;
        padding: ${isCompactHeight ? '0.5rem' : '0.65rem'};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 0.18rem;
        background: ${discovered ? `linear-gradient(135deg, #${entry.accentColor.toString(16).padStart(6, '0')}aa, rgba(255,255,255,0.16))` : 'rgba(255,255,255,0.08)'};
        color: ${discovered ? '#fff' : '#aeb8d7'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.24);
      `;

      const monthChip = document.createElement('div');
      monthChip.textContent = `${entry.month}がつ`;
      monthChip.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.7rem' : '0.8rem'};
        font-weight: 800;
      `;
      card.appendChild(monthChip);

      const emoji = document.createElement('div');
      emoji.textContent = discovered ? entry.emoji : '✨';
      emoji.style.fontSize = isCompactHeight ? '1.4rem' : '1.7rem';
      card.appendChild(emoji);

      const name = document.createElement('div');
      name.textContent = discovered ? entry.reading : '？？？';
      name.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.78rem' : '0.9rem'};
        font-weight: 900;
        overflow-wrap: anywhere;
      `;
      card.appendChild(name);

      const trivia = document.createElement('div');
      trivia.textContent = discovered ? entry.trivia : 'こんげつ みつけると ずかんに のるよ';
      trivia.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.62rem' : '0.72rem'};
        line-height: 1.3;
        overflow-wrap: anywhere;
      `;
      card.appendChild(trivia);

      panel.appendChild(card);
    }

    return panel;
  }

  private createGemPanel(isCompactHeight: boolean): HTMLDivElement {
    const panel = document.createElement('div');
    panel.setAttribute('data-encyclopedia-panel', 'gems');
    panel.style.cssText = `
      display: none;
      grid-area: 1 / 1;
      grid-template-columns: repeat(auto-fit, minmax(${isCompactHeight ? '112px' : '132px'}, 1fr));
      gap: ${isCompactHeight ? '0.45rem' : '0.6rem'};
      width: 100%;
      align-content: start;
    `;

    for (const entry of SPACE_GEM_ENCYCLOPEDIA) {
      const discovered = this.discoveredSpaceGems.includes(entry.id);
      const card = document.createElement('div');
      card.setAttribute('data-space-gem-card', '');
      card.setAttribute('data-space-gem-id', entry.id);
      card.style.cssText = `
        min-height: ${isCompactHeight ? '112px' : '132px'};
        border-radius: 18px;
        padding: ${isCompactHeight ? '0.5rem' : '0.7rem'};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 0.22rem;
        background: ${discovered ? `linear-gradient(135deg, #${entry.accentColor.toString(16).padStart(6, '0')}cc, rgba(255,255,255,0.16))` : 'rgba(255,255,255,0.08)'};
        color: ${discovered ? '#fff' : '#aeb8d7'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.24);
      `;

      const emoji = document.createElement('div');
      emoji.textContent = discovered ? entry.emoji : '🎁';
      emoji.style.fontSize = isCompactHeight ? '1.5rem' : '1.8rem';
      card.appendChild(emoji);

      const name = document.createElement('div');
      name.textContent = discovered ? entry.reading : '？？？';
      name.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.74rem' : '0.88rem'};
        font-weight: 900;
        overflow-wrap: anywhere;
      `;
      card.appendChild(name);

      const trivia = document.createElement('div');
      trivia.textContent = discovered ? entry.trivia : 'ステージで みつけると たからばこに はいるよ';
      trivia.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.6rem' : '0.72rem'};
        line-height: 1.3;
        overflow-wrap: anywhere;
      `;
      card.appendChild(trivia);

      panel.appendChild(card);
    }

    return panel;
  }

  private createConstellationSection(isCompactHeight: boolean): HTMLDivElement {
    const section = document.createElement('div');
    section.setAttribute('data-constellation-gallery', '');
    section.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: ${isCompactHeight ? '0.4rem' : '0.55rem'};
      min-width: 0;
    `;

    const title = document.createElement('div');
    title.textContent = 'せいざずかん';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1rem' : '1.15rem'};
      font-weight: 900;
      color: #9be7ff;
      text-align: center;
    `;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: ${isCompactHeight ? '0.4rem' : '0.55rem'};
      width: 100%;
      min-width: 0;
    `;

    for (const constellation of CONSTELLATION_DATA) {
      const discovered = this.discoveredConstellations.includes(constellation.stageNumber);
      const card = document.createElement('div');
      card.setAttribute('data-constellation-card', '');
      card.setAttribute('data-stage', String(constellation.stageNumber));
      card.style.cssText = `
        min-height: ${isCompactHeight ? '62px' : '74px'};
        border-radius: 16px;
        padding: ${isCompactHeight ? '0.45rem' : '0.55rem'};
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: ${isCompactHeight ? '0.45rem' : '0.55rem'};
        background: ${discovered ? 'linear-gradient(135deg, rgba(98, 220, 255, 0.35), rgba(71, 100, 255, 0.2))' : 'rgba(255, 255, 255, 0.08)'};
        color: ${discovered ? '#fff' : '#9aa7c8'};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.24);
        box-sizing: border-box;
      `;

      card.appendChild(this.createConstellationPicture(constellation, discovered, isCompactHeight));

      const textColumn = document.createElement('div');
      textColumn.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-width: 0;
      `;

      const stage = document.createElement('div');
      stage.textContent = `ステージ ${constellation.stageNumber}`;
      stage.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.68rem' : '0.76rem'};
        font-weight: 700;
      `;
      textColumn.appendChild(stage);

      const label = document.createElement('div');
      label.textContent = discovered ? constellation.name : '？？？';
      label.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.86rem' : '0.95rem'};
        font-weight: 900;
        margin-top: 0.08rem;
        text-align: left;
        overflow-wrap: anywhere;
      `;
      textColumn.appendChild(label);
      card.appendChild(textColumn);
      grid.appendChild(card);
    }

    section.appendChild(grid);
    return section;
  }

  private createConstellationPicture(
    constellation: ConstellationDefinition,
    discovered: boolean,
    isCompactHeight: boolean,
  ): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const size = isCompactHeight ? 48 : 56;
    svg.setAttribute('data-constellation-picture', '');
    svg.setAttribute('viewBox', '0 0 100 64');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(Math.round(size * 0.64)));
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = `
      flex: 0 0 auto;
      border-radius: 12px;
      background: ${discovered ? 'rgba(4, 12, 40, 0.42)' : 'rgba(255, 255, 255, 0.05)'};
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
    `;

    const points = constellation.points;
    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minZ = Math.min(...points.map((point) => point.z));
    const maxZ = Math.max(...points.map((point) => point.z));
    const spanX = Math.max(maxX - minX, 1);
    const spanZ = Math.max(maxZ - minZ, 1);
    const normalized = points.map((point) => {
      const x = 12 + ((point.x - minX) / spanX) * 76;
      const y = 10 + ((point.z - minZ) / spanZ) * 44;
      return { x, y };
    });

    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', normalized.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' '));
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', discovered ? '#bdf4ff' : '#7b86a8');
    polyline.setAttribute('stroke-width', '4');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');
    polyline.setAttribute('opacity', discovered ? '0.95' : '0.45');
    svg.appendChild(polyline);

    for (const point of normalized) {
      const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      star.setAttribute('cx', point.x.toFixed(1));
      star.setAttribute('cy', point.y.toFixed(1));
      star.setAttribute('r', discovered ? '4.8' : '4.2');
      star.setAttribute('fill', discovered ? '#fff8aa' : '#aab2d4');
      star.setAttribute('opacity', discovered ? '1' : '0.55');
      svg.appendChild(star);
    }

    return svg;
  }

  private createCard(entry: PlanetEncyclopediaEntry, isUnlocked: boolean, isCompactHeight: boolean): HTMLDivElement {
    const card = document.createElement('div');
    card.setAttribute('data-card', '');
    card.setAttribute('data-stage', String(entry.stageNumber));
    card.style.cssText = `
      min-height: ${isCompactHeight ? '82px' : '96px'};
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: ${isCompactHeight ? '0.45rem' : '0.6rem'};
      width: 100%;
      max-width: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.12s ease-out;
      transform: scale(1);
      box-sizing: border-box;
    `;

    if (isUnlocked) {
      const colorHex = '#' + entry.planetColor.toString(16).padStart(6, '0');
      card.style.background = `linear-gradient(135deg, ${colorHex}88, ${colorHex}44)`;
      card.style.cursor = 'pointer';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      const emoji = document.createElement('div');
      emoji.textContent = entry.emoji;
      emoji.setAttribute('aria-hidden', 'true');
      emoji.style.fontSize = isCompactHeight ? '1.45rem' : '1.75rem';
      card.appendChild(emoji);

      const name = document.createElement('div');
      name.textContent = this.getPlanetLabel(entry);
      name.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.76rem' : '0.88rem'};
        font-weight: 700;
        color: #fff;
        margin-top: 0.18rem;
        text-align: center;
        overflow-wrap: anywhere;
      `;
      card.appendChild(name);

      const bestCount = this.bestStageStars[entry.stageNumber] ?? 0;
      card.setAttribute('aria-label', this.getCardAriaLabel(entry, bestCount));
      const medalDisplay = createStageMedalDisplay(entry.stageNumber, bestCount, {
        hint: bestCount > 0 ? `⭐ ベスト ${bestCount}` : undefined,
        size: 'compact',
        scope: 'encyclopedia-card',
      });
      medalDisplay.style.marginTop = '0.22rem';
      card.appendChild(medalDisplay);

      this.galleryActionCleanups.add(attachReleaseConfirmButton(card, {
        onActivate: () => {
          this.showDetail(entry);
        },
        onPressChange: (pressed) => {
          card.style.transform = pressed ? 'scale(0.95)' : 'scale(1)';
        },
        moveTolerancePx: EncyclopediaOverlay.RELEASE_CONFIRM_MOVE_TOLERANCE_PX,
      }));
    } else {
      card.style.background = '#444';
      card.style.opacity = '0.6';
      card.style.pointerEvents = 'none';
      card.setAttribute('aria-disabled', 'true');
      card.setAttribute('aria-label', 'まだ みつけていない わくせい');

      const lock = document.createElement('div');
      lock.textContent = '？？？';
      lock.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.9rem' : '1.05rem'};
        color: #aaa;
        text-align: center;
      `;
      card.appendChild(lock);
    }

    return card;
  }

  private showDetail(entry: PlanetEncyclopediaEntry, onBack?: () => void): void {
    if (this.isShowingDetail) return;
    if (!this.overlayEl) return;
    this.isShowingDetail = true;
    this.cleanupActionCleanups(this.detailActionCleanups);
    const isCompactHeight = this.isCompactHeight();

    this.detailEl = document.createElement('div');
    this.detailEl.setAttribute('data-detail', '');
    this.detailEl.setAttribute('role', 'dialog');
    this.detailEl.setAttribute('aria-modal', 'true');
    this.detailEl.setAttribute('aria-labelledby', EncyclopediaOverlay.DETAIL_TITLE_ID);
    this.detailEl.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 32, 0.9);
      z-index: 31;
      padding: ${isCompactHeight ? '0.5rem' : '0.9rem'};
      box-sizing: border-box;
      overflow: hidden;
    `;

    const colorHex = '#' + entry.planetColor.toString(16).padStart(6, '0');

    const detailContent = document.createElement('div');
    detailContent.setAttribute('data-detail-content', '');
    detailContent.style.cssText = `
      width: min(560px, 100%);
      height: 100%;
      max-height: 720px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 0;
      box-sizing: border-box;
    `;

    const detailCard = document.createElement('div');
    detailCard.setAttribute('data-detail-card', '');
    detailCard.style.cssText = `
      width: min(${isCompactHeight ? '440px' : '500px'}, 100%);
      background: linear-gradient(135deg, ${colorHex}88, ${colorHex}44);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${isCompactHeight ? '0.8rem 0.9rem' : '1.15rem'};
      overflow: hidden;
      box-sizing: border-box;
    `;
    detailCard.style.overflowY = 'hidden';

    const emoji = document.createElement('div');
    emoji.textContent = entry.emoji;
    emoji.setAttribute('aria-hidden', 'true');
    emoji.style.fontSize = isCompactHeight ? '2.35rem' : '3rem';
    detailCard.appendChild(emoji);

    const name = document.createElement('div');
    name.id = EncyclopediaOverlay.DETAIL_TITLE_ID;
    name.textContent = this.getPlanetLabel(entry);
    name.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1.35rem' : '1.65rem'};
      font-weight: 700;
      color: #FFD700;
      margin: 0.25rem 0;
      text-align: center;
    `;
    detailCard.appendChild(name);

    const companionSection = document.createElement('div');
    companionSection.setAttribute('data-detail-companion', '');
    companionSection.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.2rem;
    `;

    const companionLabel = document.createElement('div');
    companionLabel.textContent = 'うちゅうの なかま';
    companionLabel.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '0.78rem' : '0.9rem'};
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.04em;
    `;
    companionSection.appendChild(companionLabel);

    const companionPreview = document.createElement('div');
    companionPreview.setAttribute('data-detail-companion-preview', '');
    companionPreview.setAttribute('aria-hidden', 'true');
    companionPreview.style.cssText = `
      width: ${isCompactHeight ? '78px' : '96px'};
      height: ${isCompactHeight ? '78px' : '96px'};
      border-radius: 20px;
      overflow: hidden;
      background: radial-gradient(circle at top, rgba(255,255,255,0.22), rgba(0,0,0,0.16));
      box-shadow: inset 0 0 18px rgba(255,255,255,0.12), 0 10px 20px rgba(0,0,0,0.22);
    `;
    companionSection.appendChild(companionPreview);
    this.getDetailPreviewController().show(entry, companionPreview);
    detailCard.appendChild(companionSection);

    const trivia = document.createElement('div');
    trivia.textContent = entry.trivia;
    trivia.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '0.9rem' : '1.05rem'};
      color: #fff;
      line-height: ${isCompactHeight ? '1.35' : '1.5'};
      padding: ${isCompactHeight ? '0.55rem 0.25rem' : '0.8rem 0.5rem'};
      text-align: center;
    `;
    detailCard.appendChild(trivia);

    const bestCount = this.bestStageStars[entry.stageNumber] ?? 0;
    const medalDisplay = createStageMedalDisplay(entry.stageNumber, bestCount, {
      label: 'メダル',
      hint: bestCount > 0 ? `⭐ ベスト ${bestCount}` : undefined,
      size: 'hero',
      scope: 'encyclopedia-detail',
    });
    medalDisplay.style.marginTop = '0.2rem';
    detailCard.appendChild(medalDisplay);

    const constellation = getConstellationForStage(entry.stageNumber);
    if (constellation) {
      const constellationInfo = document.createElement('div');
      const discovered = this.discoveredConstellations.includes(entry.stageNumber);
      constellationInfo.setAttribute('data-detail-constellation', '');
      constellationInfo.style.cssText = `
        margin-top: 0.45rem;
        padding: ${isCompactHeight ? '0.45rem 0.65rem' : '0.6rem 0.8rem'};
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
        text-align: center;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.82rem' : '0.95rem'};
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
      `;
      constellationInfo.appendChild(this.createConstellationPicture(constellation, discovered, true));
      const constellationText = document.createElement('span');
      constellationText.textContent = discovered
        ? `✨ みつけた せいざ: ${constellation.encyclopediaLabel}`
        : `💫 このステージの せいざ: ${constellation.name}`;
      constellationInfo.appendChild(constellationText);
      detailCard.appendChild(constellationInfo);
    }

    if (this.onSelectStage) {
      const playBtn = document.createElement('button');
      playBtn.setAttribute('data-detail-play', '');
      playBtn.textContent = 'このステージで あそぶ';
      playBtn.style.cssText = `
        margin-top: ${isCompactHeight ? '0.55rem' : '0.75rem'};
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${isCompactHeight ? '0.95rem' : '1.1rem'};
        font-weight: 700;
        padding: ${isCompactHeight ? '0.55rem 1rem' : '0.65rem 1.3rem'};
        border: none;
        border-radius: 1.5rem;
        background: linear-gradient(135deg, #FF6B6B, #FFE66D);
        color: #333;
        cursor: pointer;
        touch-action: manipulation;
        transform: scale(1);
        transition: transform 0.08s ease-out;
      `;
      this.detailActionCleanups.add(attachReleaseConfirmButton(playBtn, {
        onActivate: () => {
          const cb = this.onSelectStage;
          if (!cb) return;
          const stageNumber = entry.stageNumber;
          this.hide();
          cb(stageNumber);
        },
        onPressChange: (pressed) => {
          playBtn.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
        },
        moveTolerancePx: EncyclopediaOverlay.RELEASE_CONFIRM_MOVE_TOLERANCE_PX,
      }));
      detailCard.appendChild(playBtn);
    }

    detailContent.appendChild(detailCard);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.setAttribute('data-detail-back', '');
    backBtn.textContent = this.detailBackLabel;
    backBtn.style.cssText = `
      margin-top: ${isCompactHeight ? '0.55rem' : '0.8rem'};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${isCompactHeight ? '1.05rem' : '1.25rem'};
      font-weight: 700;
      padding: ${isCompactHeight ? '0.45rem 1.45rem' : '0.55rem 1.8rem'};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `;
    this.detailActionCleanups.add(attachReleaseConfirmButton(backBtn, {
      onActivate: () => {
        if (onBack) {
          this.hide();
          onBack();
          return;
        }
        this.hideDetail();
      },
      onPressChange: (pressed) => {
        backBtn.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
      },
      moveTolerancePx: EncyclopediaOverlay.RELEASE_CONFIRM_MOVE_TOLERANCE_PX,
    }));
    detailContent.appendChild(backBtn);

    this.detailEl.appendChild(detailContent);
    this.overlayEl.appendChild(this.detailEl);
  }

  private hideDetail(): void {
    this.cleanupActionCleanups(this.detailActionCleanups);
    this.hideDetailPreview();
    if (this.detailEl) {
      this.detailEl.remove();
      this.detailEl = null;
    }
    this.isShowingDetail = false;
  }

  private getDetailPreviewController(): CompanionPreviewController {
    if (!this.detailPreviewController) {
      this.detailPreviewController = this.createPreviewController();
    }
    return this.detailPreviewController;
  }

  private hideDetailPreview(): void {
    this.detailPreviewController?.hide();
  }

  private disposeDetailPreview(): void {
    this.detailPreviewController?.dispose();
    this.detailPreviewController = null;
  }

  private cleanupActionCleanups(cleanups: Set<() => void>): void {
    for (const cleanup of cleanups) {
      cleanup();
    }
    cleanups.clear();
  }

  private isCompactHeight(): boolean {
    return window.innerHeight <= EncyclopediaOverlay.COMPACT_HEIGHT_THRESHOLD;
  }

  private getCardAriaLabel(entry: PlanetEncyclopediaEntry, bestCount: number): string {
    const parts = [this.getPlanetLabel(entry)];
    if (bestCount > 0) {
      parts.push(`ベスト ほし ${bestCount}こ`);
    }
    parts.push('くわしく みる');
    return parts.join('、');
  }

  private getPlanetLabel(entry: PlanetEncyclopediaEntry): string {
    return formatPlanetEncyclopediaLabel(entry, this.colorVisionSupportMode);
  }
}
