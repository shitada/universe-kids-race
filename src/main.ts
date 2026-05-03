import { createRetryableModuleLoader } from './game/utils/createRetryableModuleLoader';
import { LoadFailureOverlay } from './ui/LoadFailureOverlay';
import { LoadingOverlay } from './ui/LoadingOverlay';

interface BootstrapGameModule {
  bootstrapGame: (options: {
    canvas: HTMLCanvasElement;
    loadingOverlay?: LoadingOverlay;
    loadFailureOverlay?: LoadFailureOverlay;
  }) => Promise<void>;
}

export interface StartMainBootstrapOptions {
  canvas: HTMLCanvasElement;
  loadBootstrapModule?: () => Promise<BootstrapGameModule>;
  loadingOverlay?: LoadingOverlay;
  loadFailureOverlay?: LoadFailureOverlay;
}

export function startMainBootstrap(options: StartMainBootstrapOptions): Promise<void> {
  const loadingOverlay = options.loadingOverlay ?? new LoadingOverlay();
  const loadFailureOverlay = options.loadFailureOverlay ?? new LoadFailureOverlay();
  const loadBootstrapModuleWithRetry = createRetryableModuleLoader(
    options.loadBootstrapModule ?? (() => import('./game/bootstrapGame')),
  );

  const startBoot = (): Promise<void> => {
    loadFailureOverlay.hide();
    loadingOverlay.show('ゲームの じゅんび ちゅう...');

    return loadBootstrapModuleWithRetry()
      .then(({ bootstrapGame }) =>
        bootstrapGame({
          canvas: options.canvas,
          loadingOverlay,
          loadFailureOverlay,
        }),
      )
      .catch((error: unknown) => {
        console.error('Failed to bootstrap game', error);
        loadingOverlay.hide();
        loadFailureOverlay.show({
          title: 'ゲームの じゅんびが できなかったよ',
          message: 'ボタンを おして もういちど ためそう！',
          primaryAction: {
            label: 'もういちど',
            onSelect: startBoot,
          },
        });
      });
  };

  return startBoot();
}

const canvas = document.getElementById('game-canvas');

if (canvas instanceof HTMLCanvasElement) {
  void startMainBootstrap({ canvas });
}
