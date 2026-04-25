import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';
import { MeshBasicNodeMaterial } from 'three/webgpu';
import * as culori from 'culori';
import { main } from './shaderNode.js';
import {
    u_time, u_resolution, u_mouse, u_speed,
    u_color1, u_color2, u_color3, u_color4,
    u_brightness, u_contrast, u_noise,
    u_spiral_density, u_star_density, u_core_size
} from './commonUniforms.js';

class WebGPUGradient {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);

        if (!this.canvas) {
            console.error(`Canvas con id "${canvasId}" no encontrado.`);
            return;
        }

        this.init();
    }

    async init() {
        this.scene  = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
        this.camera.position.z = 1;

        this.renderer = new WebGPURenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        try {
            await this.renderer.init();
        } catch (error) {
            console.error('Error al inicializar WebGPURenderer:', error);
            return;
        }

        // Uniforms
        u_speed.value           = 0.192;
        u_color1.value          = this.oklchToThree({ l: 0.805, c: 0.155, h: 281.3 });
        u_color2.value          = this.oklchToThree({ l: 0.488, c: 0.141, h: 284.7 });
        u_color3.value          = this.oklchToThree({ l: 0.349, c: 0.132, h: 321.1 });
        u_color4.value          = this.oklchToThree({ l: 0.325, c: 0.216, h: 2.6   });
        u_brightness.value      = -0.002;
        u_contrast.value        = 1.117;
        u_noise.value           = 0;
        u_spiral_density.value  = 15.5;
        u_star_density.value    = 24;
        u_core_size.value       = 0.4;

        // Mesh
        const material   = new MeshBasicNodeMaterial();
        material.colorNode = main();
        const geometry   = new THREE.PlaneGeometry(2, 2);
        this.mesh        = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);

        this.clock = new THREE.Clock();

        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize();

        window.addEventListener('pointermove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const w    = Math.max(rect.width,  1);
            const h    = Math.max(rect.height, 1);
            u_mouse.value.set(
                (event.clientX - rect.left) / w,
                1 - (event.clientY - rect.top) / h
            );
        }, { passive: true });

        this.animate();
    }

    oklchToThree(oklch) {
        const rgb = culori.rgb({ mode: 'oklch', ...oklch });
        return new THREE.Color(rgb.r, rgb.g, rgb.b);
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const px = this.renderer.getPixelRatio();
        u_resolution.value.set(window.innerWidth * px, window.innerHeight * px);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        u_time.value = this.clock.getElapsedTime();
        this.renderer.render(this.scene, this.camera);
    }
}

new WebGPUGradient('gradient-canvas');