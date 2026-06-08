import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { useEditorStore, CAR_CONFIGS } from '../store/useEditorStore';
import type { DecalItem } from '../store/useEditorStore';
import { getStickerTexture } from '../utils/textureUtils';

// Preload all models upfront
CAR_CONFIGS.forEach((c) => useGLTF.preload(c.file));

// Custom texture cache (object URLs)
const customTexCache = new Map<string, THREE.Texture>();
function getCustomTexture(url: string): THREE.Texture {
  if (customTexCache.has(url)) return customTexCache.get(url)!;
  const tex = new THREE.TextureLoader().load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  customTexCache.set(url, tex);
  return tex;
}

// Mesh cache: scene file -> Map<meshName, THREE.Mesh>
const meshCache = new Map<string, Map<string, THREE.Mesh>>();

function buildMeshCache(scene: THREE.Object3D, file: string) {
  if (meshCache.has(file)) return meshCache.get(file)!;
  const map = new Map<string, THREE.Mesh>();
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.name) {
      map.set(child.name, child);
    }
  });
  meshCache.set(file, map);
  return map;
}

// ── Inner component (loads one car) ─────────────────────────────────────
function CarScene({ file, paintMaterialNames }: { file: string; paintMaterialNames: string[] }) {
  const { scene, materials } = useGLTF(file) as any;
  const decalGroupRef = useRef<THREE.Group>(null!);

  const {
    paintColor, metalness, roughness,
    decals, selectedCarId,
    mode, addDecal, pendingSticker,
    setActiveDecalId, activeDecalId,
  } = useEditorStore();

  // Apply paint color
  useEffect(() => {
    if (!materials) return;
    paintMaterialNames.forEach((name) => {
      const mat = materials[name];
      if (mat) {
        mat.color.set(paintColor);
        mat.metalness = metalness;
        mat.roughness = roughness;
        mat.needsUpdate = true;
      }
    });
  }, [paintColor, metalness, roughness, materials, paintMaterialNames]);

  // Rebuild decals whenever the decals array changes
  useEffect(() => {
    const group = decalGroupRef.current;
    if (!group || !scene) return;

    // Dispose all old decal meshes
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      child.geometry?.dispose();
      (child.material as THREE.Material)?.dispose();
      group.remove(child);
    }

    const meshMap = buildMeshCache(scene, file);
    const currentDecals = decals.filter((d) => d.carId === selectedCarId);

    currentDecals.forEach((decal: DecalItem) => {
      // Find the exact mesh that was clicked when this decal was placed
      const targetMesh = meshMap.get(decal.targetMeshName);
      if (!targetMesh) return;

      const position = new THREE.Vector3(...decal.position);
      const normal   = new THREE.Vector3(...decal.normal).normalize();

      // Compute orientation aligned to surface normal
      const up = Math.abs(normal.y) < 0.95
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(1, 0, 0);
      const lookMatrix = new THREE.Matrix4().lookAt(
        position.clone().add(normal),
        position,
        up,
      );
      const orientation = new THREE.Euler().setFromRotationMatrix(lookMatrix);
      orientation.z += decal.rotation;

      const s = decal.size;
      const size = new THREE.Vector3(s, s, s * 0.6);

      try {
        const geometry = new DecalGeometry(targetMesh, position, orientation, size);
        const texture =
          decal.type === 'custom' && decal.customUrl
            ? getCustomTexture(decal.customUrl)
            : getStickerTexture(decal.type);

        const material = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -8,
          roughness: 0.3,
          metalness: 0.0,
          alphaTest: 0.02,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData.decalId = decal.id;
        mesh.renderOrder = 3;
        group.add(mesh);
      } catch {
        // Out of mesh bounds — skip gracefully
      }
    });
  }, [decals, selectedCarId, scene, file]);

  // Place decal on click
  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (mode !== 'place' || !pendingSticker) return;
      e.stopPropagation();

      const clickedMesh = e.object;
      if (!(clickedMesh instanceof THREE.Mesh)) return;

      const meshName = clickedMesh.name;
      if (!meshName) return; // Skip unnamed meshes

      const point  = e.point.clone();
      const normal = (e.face?.normal?.clone() ?? new THREE.Vector3(0, 1, 0));
      normal.transformDirection(clickedMesh.matrixWorld).normalize();

      addDecal(
        pendingSticker.type,
        pendingSticker.label,
        point,
        normal,
        meshName,
        pendingSticker.customUrl,
      );
    },
    [mode, pendingSticker, addDecal],
  );

  // Select decal on click
  const handleDecalClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (mode === 'place') return;
      e.stopPropagation();
      const id = e.object.userData.decalId as string | undefined;
      if (id) setActiveDecalId(id === activeDecalId ? null : id);
    },
    [mode, activeDecalId, setActiveDecalId],
  );

  if (!scene) return null;

  return (
    <group>
      <primitive object={scene} onPointerDown={handlePointerDown} />
      <group ref={decalGroupRef} onClick={handleDecalClick} />
    </group>
  );
}

// ── Public component ─────────────────────────────────────────────────────
export default function CarModel() {
  const { selectedCarId } = useEditorStore();
  const config = CAR_CONFIGS.find((c) => c.id === selectedCarId)!;

  return (
    <CarScene
      key={config.id}
      file={config.file}
      paintMaterialNames={config.paintMaterialNames}
    />
  );
}
