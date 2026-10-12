"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import {
  type BufferGeometry,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PMREMGenerator,
  RingGeometry,
  Scene,
} from "three";

interface Panel {
  shape: "rect" | "ring";
  color: string;
  intensity: number;
  scale: [number, number];
  position: [number, number, number];
}

/**
 * Emissive "light panels" that the metal and glass reflect. Every panel faces
 * the origin. Rendered once into a PMREM — no HDR files or loaders needed.
 */
const PANELS: Panel[] = [
  { shape: "rect", color: "#45d9ff", intensity: 2.6, scale: [10, 1.2], position: [-5, 2, 2] },
  { shape: "rect", color: "#8b70ff", intensity: 3.2, scale: [10, 1.6], position: [5, -1, -2] },
  { shape: "ring", color: "#ffffff", intensity: 1.4, scale: [4, 4], position: [0, 5, -6] },
  { shape: "rect", color: "#9eeaff", intensity: 0.8, scale: [20, 0.4], position: [0, -3, 6] },
  // Overhead panels so the slab tops pick up a cool sheen instead of empty sky.
  { shape: "rect", color: "#3a4f8f", intensity: 1.1, scale: [14, 14], position: [0, 7, 0] },
  { shape: "rect", color: "#45d9ff", intensity: 1.8, scale: [3, 12], position: [2, 6, 3] },
  // Low horizon band behind the tower: what the slab tops reflect from this camera angle.
  { shape: "rect", color: "#4f62b8", intensity: 1.25, scale: [22, 2.2], position: [0, 1.2, -9] },
];

export function ProceduralEnvironment({ size = 256 }: { size?: number }) {
  const getState = useThree((state) => state.get);

  useEffect(() => {
    const { gl, scene } = getState();
    const envScene = new Scene();
    envScene.background = new Color("#000000");
    const geometries: BufferGeometry[] = [];
    const materials: MeshBasicMaterial[] = [];

    for (const panel of PANELS) {
      const geometry = panel.shape === "ring" ? new RingGeometry(0.5, 1, 48) : new PlaneGeometry(1, 1);
      const material = new MeshBasicMaterial({
        color: new Color(panel.color).multiplyScalar(panel.intensity),
        side: DoubleSide,
        toneMapped: false,
      });
      const mesh = new Mesh(geometry, material);
      mesh.position.set(...panel.position);
      mesh.scale.set(panel.scale[0], panel.scale[1], 1);
      mesh.lookAt(0, 0, 0);
      envScene.add(mesh);
      geometries.push(geometry);
      materials.push(material);
    }

    const pmrem = new PMREMGenerator(gl);
    const target = pmrem.fromScene(envScene, 0, 0.1, 100, { size });
    scene.environment = target.texture;

    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    pmrem.dispose();

    return () => {
      if (scene.environment === target.texture) scene.environment = null;
      target.dispose();
    };
  }, [getState, size]);

  return null;
}
