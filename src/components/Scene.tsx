import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Grid,
  PerspectiveCamera,
} from '@react-three/drei';
import CarModel from './CarModel';
import { useEditorStore, CAR_CONFIGS } from '../store/useEditorStore';
import * as THREE from 'three';

function StudioFloor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#08080f" metalness={0.2} roughness={0.8} />
      </mesh>
      <Grid
        position={[0, -0.005, 0]}
        args={[80, 80]}
        cellSize={0.6}
        cellThickness={0.4}
        cellColor="#1e1b4b"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#312e81"
        fadeDistance={22}
        fadeStrength={2}
        infiniteGrid
      />
    </>
  );
}

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <directionalLight position={[-6, 6, -4]} intensity={1.1} color="#a5b4fc" />
      <pointLight position={[0, 5, 4]} intensity={2.2} color="#ffffff" distance={18} />
      <pointLight position={[0, 3, -5]} intensity={1} color="#6366f1" distance={12} />
    </>
  );
}

function PlaceModeBanner() {
  const { mode, setMode, setPendingSticker } = useEditorStore();
  if (mode !== 'place') return null;
  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
      <div className="flex items-center gap-3 bg-amber-500 text-black text-sm font-bold px-5 py-2.5 rounded-full shadow-2xl shadow-amber-900/60 animate-bounce">
        <span className="text-lg">👆</span>
        <span>Kliknij na karoserię auta</span>
        <button
          onClick={() => { setMode('orbit'); setPendingSticker(null); }}
          className="ml-2 w-6 h-6 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center font-black"
        >✕</button>
      </div>
    </div>
  );
}

// Adaptive camera based on selected car
function AdaptiveCamera() {
  const { selectedCarId } = useEditorStore();
  const config = CAR_CONFIGS.find(c => c.id === selectedCarId)!;
  const pos = config.cameraPos ?? [4.5, 2.5, 5.5];
  return <PerspectiveCamera makeDefault position={pos as [number,number,number]} fov={38} />;
}

export default function Scene() {
  const { mode, setActiveDecalId, selectedCarId } = useEditorStore();
  const config = CAR_CONFIGS.find(c => c.id === selectedCarId)!;

  return (
    <div className="relative flex-1 h-full bg-[#06060e]">
      <PlaceModeBanner />
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        onPointerMissed={() => setActiveDecalId(null)}
      >
        <AdaptiveCamera />

        <Suspense fallback={null}>
          <StudioLights />
          <StudioFloor />
          <Environment preset="city" background={false} />
          <CarModel />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.8}
            scale={14}
            blur={3.5}
            far={2.5}
            resolution={512}
            color="#000014"
          />
          <OrbitControls
            enablePan={false}
            minPolarAngle={0.05}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={2}
            maxDistance={14}
            enabled={mode !== 'place'}
            target={config.cameraTarget as [number, number, number]}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-3 right-4 text-slate-700 text-xs font-mono pointer-events-none">
        WrapStudio · Three.js
      </div>
    </div>
  );
}
