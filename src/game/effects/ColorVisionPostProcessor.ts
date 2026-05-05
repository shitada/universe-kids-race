import * as THREE from 'three';
import type { ColorVisionSupportMode } from '../../types';
import { DEFAULT_COLOR_VISION_SUPPORT_MODE } from '../config/PlanetEncyclopedia';
import { getColorVisionFilterConfig, isColorVisionFilterMode } from '../accessibility/colorVisionFilters';

let activeColorVisionSupportMode: ColorVisionSupportMode = DEFAULT_COLOR_VISION_SUPPORT_MODE;

export function getActiveColorVisionSupportMode(): ColorVisionSupportMode {
  return activeColorVisionSupportMode;
}

export function setActiveColorVisionSupportMode(mode: ColorVisionSupportMode): void {
  activeColorVisionSupportMode = mode;
}

export class ColorVisionPostProcessor {
  private readonly renderTarget: THREE.WebGLRenderTarget;
  private readonly postScene: THREE.Scene;
  private readonly postCamera: THREE.OrthographicCamera;
  private readonly quadMaterial: THREE.ShaderMaterial;
  private readonly quad: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private mode: ColorVisionSupportMode = DEFAULT_COLOR_VISION_SUPPORT_MODE;

  constructor(private readonly renderer: Pick<THREE.WebGLRenderer, 'render' | 'setRenderTarget'>) {
    this.renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      depthBuffer: true,
      stencilBuffer: false,
    });
    this.postScene = new THREE.Scene();
    this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quadMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: this.renderTarget.texture },
        colorMatrix: { value: new THREE.Matrix3() },
        saturation: { value: 1 },
        contrast: { value: 1 },
        lift: { value: new THREE.Vector3(0, 0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform mat3 colorMatrix;
        uniform float saturation;
        uniform float contrast;
        uniform vec3 lift;
        varying vec2 vUv;

        void main() {
          vec4 baseColor = texture2D(tDiffuse, vUv);
          vec3 transformed = colorMatrix * baseColor.rgb;
          vec3 contrasted = ((transformed - 0.5) * contrast) + 0.5;
          float luminance = dot(contrasted, vec3(0.2126, 0.7152, 0.0722));
          vec3 saturated = mix(vec3(luminance), contrasted, saturation);
          gl_FragColor = vec4(clamp(saturated + lift, 0.0, 1.0), baseColor.a);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.quadMaterial);
    this.postScene.add(this.quad);
    this.setMode(DEFAULT_COLOR_VISION_SUPPORT_MODE);
  }

  setSize(width: number, height: number): void {
    this.renderTarget.setSize(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
  }

  getMode(): ColorVisionSupportMode {
    return this.mode;
  }

  setMode(mode: ColorVisionSupportMode): void {
    this.mode = mode;
    const config = getColorVisionFilterConfig(mode);
    if (!config) {
      this.quadMaterial.uniforms.saturation.value = 1;
      this.quadMaterial.uniforms.contrast.value = 1;
      this.quadMaterial.uniforms.lift.value.set(0, 0, 0);
      this.quadMaterial.uniforms.colorMatrix.value.set(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
      );
      return;
    }

    this.quadMaterial.uniforms.colorMatrix.value.set(...config.matrix);
    this.quadMaterial.uniforms.saturation.value = config.saturation;
    this.quadMaterial.uniforms.contrast.value = config.contrast;
    this.quadMaterial.uniforms.lift.value.set(...config.lift);
  }

  render(scene: THREE.Scene, camera: THREE.Camera): void {
    if (!isColorVisionFilterMode(this.mode)) {
      this.renderer.setRenderTarget(null);
      this.renderer.render(scene, camera);
      return;
    }

    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(scene, camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.postScene, this.postCamera);
  }

  dispose(): void {
    this.renderTarget.dispose();
    this.quad.geometry.dispose();
    this.quadMaterial.dispose();
  }
}
