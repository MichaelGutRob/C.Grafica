import * as THREE from 'three';
import { uniform } from 'three/tsl';

export const u_time       = uniform(0.0);
export const u_resolution = uniform(new THREE.Vector2(window.innerWidth, window.innerHeight));
export const u_mouse      = uniform(new THREE.Vector2(0.5, 0.5));
export const u_speed      = uniform(0.192);

export const u_color1     = uniform(new THREE.Color());
export const u_color2     = uniform(new THREE.Color());
export const u_color3     = uniform(new THREE.Color());
export const u_color4     = uniform(new THREE.Color());

export const u_brightness     = uniform(-0.002);
export const u_contrast       = uniform(1.117);
export const u_noise          = uniform(0.0);
export const u_spiral_density = uniform(15.5);
export const u_star_density   = uniform(24.0);
export const u_core_size      = uniform(0.4);