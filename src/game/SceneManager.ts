import type * as THREE from 'three';
import type { Scene, SceneType, SceneContext } from '../types';

type SceneFactory = () => Scene | Promise<Scene>;

export class SceneManager {
  private scenes = new Map<SceneType, Scene>();
  private sceneFactories = new Map<SceneType, SceneFactory>();
  private sceneLoadPromises = new Map<SceneType, Promise<Scene>>();
  private currentScene: Scene | null = null;
  private currentType: SceneType | null = null;
  private onTransitionRequest:
    | ((sceneType: SceneType, context?: SceneContext) => void | Promise<void>)
    | null = null;
  private onLoadStateChange: ((isLoading: boolean, sceneType: SceneType) => void) | null = null;
  private inFlightTransition:
    | {
        sceneType: SceneType;
        promise: Promise<void>;
      }
    | null = null;

  registerScene(type: SceneType, scene: Scene): void {
    this.scenes.set(type, scene);
  }

  registerSceneFactory(type: SceneType, factory: SceneFactory): void {
    this.sceneFactories.set(type, factory);
  }

  setTransitionHandler(handler: (sceneType: SceneType, context?: SceneContext) => void | Promise<void>): void {
    this.onTransitionRequest = handler;
  }

  setLoadStateHandler(handler: (isLoading: boolean, sceneType: SceneType) => void): void {
    this.onLoadStateChange = handler;
  }

  requestTransition(sceneType: SceneType, context?: SceneContext): void {
    if (this.onTransitionRequest) {
      void this.onTransitionRequest(sceneType, context);
    } else {
      void this.transitionTo(sceneType, context);
    }
  }

  prefetchScene(sceneType: SceneType): Promise<void> {
    return this.resolveScene(sceneType).then(() => undefined);
  }

  transitionTo(sceneType: SceneType, context: SceneContext = {}): Promise<void> {
    if (this.inFlightTransition?.sceneType === sceneType) {
      return this.inFlightTransition.promise;
    }

    const promise = this.performTransition(sceneType, context);
    this.inFlightTransition = { sceneType, promise };
    return promise.finally(() => {
      if (this.inFlightTransition?.promise === promise) {
        this.inFlightTransition = null;
      }
    });
  }

  private resolveScene(sceneType: SceneType): Promise<Scene | null> {
    const cachedScene = this.scenes.get(sceneType);
    if (cachedScene) {
      return Promise.resolve(cachedScene);
    }

    const existingPromise = this.sceneLoadPromises.get(sceneType);
    if (existingPromise) {
      return existingPromise;
    }

    const factory = this.sceneFactories.get(sceneType);
    if (!factory) {
      return Promise.resolve(null);
    }

    const scenePromise = Promise.resolve(factory()).then((scene) => {
      this.scenes.set(sceneType, scene);
      this.sceneLoadPromises.delete(sceneType);
      return scene;
    }).catch((error: unknown) => {
      this.sceneLoadPromises.delete(sceneType);
      throw error;
    });

    this.sceneLoadPromises.set(sceneType, scenePromise);
    return scenePromise;
  }

  private performTransition(sceneType: SceneType, context: SceneContext): Promise<void> {
    const isLazyLoadNeeded =
      !this.scenes.has(sceneType) &&
      (this.sceneLoadPromises.has(sceneType) || this.sceneFactories.has(sceneType));

    if (isLazyLoadNeeded) {
      this.onLoadStateChange?.(true, sceneType);
    }

    return this.resolveScene(sceneType)
      .then((nextScene) => {
        if (!nextScene) return;

        if (this.currentScene) {
          this.currentScene.exit();
        }

        this.currentScene = nextScene;
        this.currentType = sceneType;
        this.currentScene.enter(context);
      })
      .finally(() => {
        if (isLazyLoadNeeded) {
          this.onLoadStateChange?.(false, sceneType);
        }
      });
  }

  update(deltaTime: number): void {
    this.currentScene?.update(deltaTime);
  }

  getCurrentThreeScene(): THREE.Scene | null {
    return this.currentScene?.getThreeScene() ?? null;
  }

  getCurrentCamera(): THREE.Camera | null {
    return this.currentScene?.getCamera() ?? null;
  }

  getCurrentType(): SceneType | null {
    return this.currentType;
  }
}
