import { createRetryableModuleLoader } from './game/utils/createRetryableModuleLoader';
import { LoadFailureOverlay } from './ui/LoadFailureOverlay';
import { LoadingOverlay } from './ui/LoadingOverlay';

export interface MainBootstrapHandle {
  dispose(): void;
}

interface BootstrapGameModule {
  bootstrapGame: (options: {
    canvas: HTMLCanvasElement;
    loadingOverlay?: LoadingOverlay;
    loadFailureOverlay?: LoadFailureOverlay;
  }) => Promise<MainBootstrapHandle>;
}

export interface StartMainBootstrapOptions {
  canvas: HTMLCanvasElement;
  loadBootstrapModule?: () => Promise<BootstrapGameModule>;
  loadingOverlay?: LoadingOverlay;
  loadFailureOverlay?: LoadFailureOverlay;
}

const noopBootstrapHandle: MainBootstrapHandle = {
  dispose(): void {},
};

let activeBootstrapHandle: MainBootstrapHandle | null = null;
let activeBootstrapRequestId = 0;

function disposeActiveBootstrapHandle(): void {
  activeBootstrapHandle?.dispose();
  activeBootstrapHandle = null;
}

export function startMainBootstrap(options: StartMainBootstrapOptions): Promise<MainBootstrapHandle> {
  const loadingOverlay = options.loadingOverlay ?? new LoadingOverlay();
  const loadFailureOverlay = options.loadFailureOverlay ?? new LoadFailureOverlay();
  const loadBootstrapModuleWithRetry = createRetryableModuleLoader(
    options.loadBootstrapModule ?? (() => import('./game/bootstrapGame')),
  );
  const requestId = ++activeBootstrapRequestId;

  const startBoot = (): Promise<MainBootstrapHandle> => {
    if (requestId !== activeBootstrapRequestId) {
      return Promise.resolve(noopBootstrapHandle);
    }

    loadFailureOverlay.hide();
    loadingOverlay.show('ゲームの じゅんび ちゅう...');

    return loadBootstrapModuleWithRetry()
      .then(({ bootstrapGame }) => {
        if (requestId !== activeBootstrapRequestId) {
          return noopBootstrapHandle;
        }

        disposeActiveBootstrapHandle();
        return bootstrapGame({
          canvas: options.canvas,
          loadingOverlay,
          loadFailureOverlay,
        });
      })
      .then((handle) => {
        if (requestId !== activeBootstrapRequestId) {
          handle.dispose();
          return noopBootstrapHandle;
        }

        activeBootstrapHandle = handle;
        return handle;
      })
      .catch((error: unknown) => {
        if (requestId !== activeBootstrapRequestId) {
          return noopBootstrapHandle;
        }

        console.error('Failed to bootstrap game', error);
        loadingOverlay.hide();
        loadFailureOverlay.show({
          title: 'ゲームの じゅんびが できなかったよ',
          message: 'ボタンを おして もういちど ためそう！',
          primaryAction: {
            label: 'もういちど',
            onSelect: () => startBoot().then(() => undefined),
          },
        });
        return noopBootstrapHandle;
      });
  };

  return startBoot();
}

const canvas = document.getElementById('game-canvas');

if (canvas instanceof HTMLCanvasElement) {
  void startMainBootstrap({ canvas });
}
