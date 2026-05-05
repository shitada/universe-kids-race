import {
  GameStateBackup,
  type BackupSceneType,
  type GameStateBackupSnapshot,
} from '../storage/GameStateBackup';
import type { ResumeGentlyOverlayOptions } from '../../ui/ResumeGentlyOverlay';

export interface InterruptionSceneState {
  sceneType: BackupSceneType;
  stagePlaying: boolean;
  userPaused: boolean;
}

export interface InterruptionSystemOptions {
  getSceneState: () => InterruptionSceneState;
  isGamePaused: () => boolean;
  isPortraitLocked: () => boolean;
  isBlockingOverlayVisible?: () => boolean;
  pauseGame: () => void;
  resumeGame: () => void;
  restoreViewport: () => void;
  showResumeOverlay: (options: ResumeGentlyOverlayOptions) => void;
  hideResumeOverlay: () => void;
  requestResumeCountdown: () => void;
  getPausedDurationMs?: () => number | null;
  backup?: GameStateBackup;
  now?: () => number;
}

type InterruptionReason = GameStateBackupSnapshot['reason'];

export class InterruptionSystem {
  private pendingBackgroundResume = false;
  private readonly getSceneState: () => InterruptionSceneState;
  private readonly isGamePaused: () => boolean;
  private readonly isPortraitLocked: () => boolean;
  private readonly isBlockingOverlayVisible: () => boolean;
  private readonly pauseGame: () => void;
  private readonly resumeGame: () => void;
  private readonly restoreViewport: () => void;
  private readonly showResumeOverlay: (options: ResumeGentlyOverlayOptions) => void;
  private readonly hideResumeOverlay: () => void;
  private readonly requestResumeCountdown: () => void;
  private readonly getPausedDurationMs: (() => number | null) | undefined;
  private readonly backup: GameStateBackup;
  private readonly now: () => number;

  constructor(options: InterruptionSystemOptions) {
    this.getSceneState = options.getSceneState;
    this.isGamePaused = options.isGamePaused;
    this.isPortraitLocked = options.isPortraitLocked;
    this.isBlockingOverlayVisible = options.isBlockingOverlayVisible ?? (() => false);
    this.pauseGame = options.pauseGame;
    this.resumeGame = options.resumeGame;
    this.restoreViewport = options.restoreViewport;
    this.showResumeOverlay = options.showResumeOverlay;
    this.hideResumeOverlay = options.hideResumeOverlay;
    this.requestResumeCountdown = options.requestResumeCountdown;
    this.getPausedDurationMs = options.getPausedDurationMs;
    this.backup = options.backup ?? new GameStateBackup();
    this.now = options.now ?? (() => Date.now());
  }

  handleHide(reason: InterruptionReason): void {
    const sceneState = this.getSceneState();
    this.pendingBackgroundResume = !sceneState.userPaused;

    if (this.pendingBackgroundResume) {
      this.backup.save({
        sceneType: sceneState.sceneType,
        stagePlaying: sceneState.stagePlaying,
        userPaused: sceneState.userPaused,
        reason,
      });
    } else {
      this.backup.clear();
    }

    this.pauseGame();
  }

  handleShow(): void {
    this.restoreViewport();
    if (this.isPortraitLocked() || this.isBlockingOverlayVisible()) {
      return;
    }
    this.applyRestoreMode(true);
  }

  handlePortrait(): void {
    this.hideResumeOverlay();
  }

  handleLandscape(): void {
    this.restoreViewport();
    if (this.isBlockingOverlayVisible()) {
      return;
    }
    this.applyRestoreMode(this.pendingBackgroundResume || this.backup.loadRecent() !== null);
  }

  clear(): void {
    this.pendingBackgroundResume = false;
    this.backup.clear();
    this.hideResumeOverlay();
  }

  private applyRestoreMode(allowResumeOverlay: boolean): void {
    const snapshot = this.backup.loadRecent();
    const sceneState = this.getSceneState();

    if (!this.isGamePaused()) {
      this.hideResumeOverlay();
      this.clearPendingBackup();
      return;
    }

    if (sceneState.sceneType !== 'stage') {
      this.hideResumeOverlay();
      this.clearPendingBackup();
      this.resumeGame();
      return;
    }

    if (sceneState.userPaused || snapshot?.userPaused) {
      this.hideResumeOverlay();
      this.clearPendingBackup();
      return;
    }

    if (allowResumeOverlay && (sceneState.stagePlaying || snapshot?.stagePlaying)) {
      this.showResumeOverlay({
        ...this.getOverlayCopy(snapshot),
        onResume: () => {
          this.clearPendingBackup();
          this.resumeGame();
          this.requestResumeCountdown();
        },
      });
      return;
    }

    this.hideResumeOverlay();
    this.clearPendingBackup();
    this.resumeGame();
  }

  private clearPendingBackup(): void {
    this.pendingBackgroundResume = false;
    this.backup.clear();
  }

  private getOverlayCopy(snapshot: GameStateBackupSnapshot | null): Omit<ResumeGentlyOverlayOptions, 'onResume'> {
    const pausedDurationMs = this.getPausedDurationMs?.() ?? (
      snapshot ? Math.max(0, this.now() - snapshot.savedAt) : 0
    );

    if (pausedDurationMs >= 30_000) {
      return {
        title: 'ゆっくり もどろう！',
        detail: 'あわてなくて だいじょうぶ。つづきから やさしく はじめよう ✨',
        actionLabel: 'タップして つづきを あそぶ',
      };
    }

    return {
      title: 'おかえり！',
      detail: 'だいじょうぶ。つづきから すぐに あそべるよ ✨',
      actionLabel: 'タップして さいかい',
    };
  }
}
