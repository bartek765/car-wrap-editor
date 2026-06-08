import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';

export type StickerType = 'star' | 'flame' | 'racing' | 'lightning' | 'skull' | 'stripes' | 'number42' | 'custom' | 'circle' | 'square' | 'triangle' | 'line_straight' | 'line_diagonal';

export type CarId = 'ferrari' | 'concept' | 'porsche' | 'suv';

export interface CarConfig {
  id: CarId;
  name: string;
  subtitle: string;
  file: string;
  paintMaterialNames: string[]; // all paint material names to recolor
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
}

export const CAR_CONFIGS: CarConfig[] = [
  {
    id: 'ferrari',
    name: 'Ferrari F40',
    subtitle: 'Supercar · 1992',
    file: '/models/ferrari.glb',
    paintMaterialNames: ['Body_Color'],
    cameraPos: [4.5, 2.2, 5.5],
    cameraTarget: [0, 0.5, 0],
  },
  {
    id: 'concept',
    name: 'Sport Concept',
    subtitle: 'Concept Car · Full Interior',
    file: '/models/car_concept.glb',
    paintMaterialNames: ['Paint 1 Carmine', 'Paint 2 Carmine'],
    cameraPos: [5.5, 2.8, 6.5],
    cameraTarget: [0, 0.6, 0],
  },
  {
    id: 'porsche',
    name: 'Sport Coupe',
    subtitle: 'Coupe · High Poly',
    file: '/models/porsche.glb',
    paintMaterialNames: ['Material.005', 'Material.006'],
    cameraPos: [4.0, 2.0, 5.0],
    cameraTarget: [0, 0.5, 0],
  },
  {
    id: 'suv',
    name: 'Heavy SUV',
    subtitle: 'Truck · Military',
    file: '/models/suv.glb',
    paintMaterialNames: ['CougarOne'],
    cameraPos: [6.0, 3.5, 7.0],
    cameraTarget: [0, 1.0, 0],
  },
];

export interface DecalItem {
  id: string;
  type: StickerType;
  label: string;
  customUrl?: string;
  position: [number, number, number];
  normal: [number, number, number];
  rotation: number;
  size: number;
  carId: CarId;
  targetMeshName: string; // name of the exact mesh that was clicked
}

export interface EditorState {
  selectedCarId: CarId;
  setSelectedCarId: (id: CarId) => void;

  paintColor: string;
  setPaintColor: (color: string) => void;
  metalness: number;
  setMetalness: (v: number) => void;
  roughness: number;
  setRoughness: (v: number) => void;

  decals: DecalItem[];
  addDecal: (
    type: StickerType,
    label: string,
    point: THREE.Vector3,
    normal: THREE.Vector3,
    targetMeshName: string,
    customUrl?: string
  ) => void;
  removeDecal: (id: string) => void;
  updateDecalSize: (id: string, size: number) => void;
  updateDecalRotation: (id: string, rot: number) => void;

  activeDecalId: string | null;
  setActiveDecalId: (id: string | null) => void;

  mode: 'orbit' | 'place';
  setMode: (mode: 'orbit' | 'place') => void;
  pendingSticker: { type: StickerType; label: string; customUrl?: string } | null;
  setPendingSticker: (s: { type: StickerType; label: string; customUrl?: string } | null) => void;

  customStickers: { id: string; url: string; label: string }[];
  addCustomSticker: (url: string, label: string) => void;
  removeCustomSticker: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedCarId: 'ferrari',
  setSelectedCarId: (id) => set({ selectedCarId: id, activeDecalId: null }),

  paintColor: '#b91c1c',
  setPaintColor: (color) => set({ paintColor: color }),
  metalness: 0.88,
  setMetalness: (v) => set({ metalness: v }),
  roughness: 0.12,
  setRoughness: (v) => set({ roughness: v }),

  decals: [],
  addDecal: (type, label, point, normal, targetMeshName, customUrl) =>
    set((state) => ({
      decals: [
        ...state.decals,
        {
          id: uuidv4(),
          type,
          label,
          customUrl,
          position: [point.x, point.y, point.z],
          normal: [normal.x, normal.y, normal.z],
          rotation: 0,
          size: 0.38,
          carId: state.selectedCarId,
          targetMeshName,
        } satisfies DecalItem,
      ],
      mode: 'orbit',
      pendingSticker: null,
    })),

  removeDecal: (id) =>
    set((state) => ({
      decals: state.decals.filter((d) => d.id !== id),
      activeDecalId: state.activeDecalId === id ? null : state.activeDecalId,
    })),

  updateDecalSize: (id, size) =>
    set((state) => ({
      decals: state.decals.map((d) => (d.id === id ? { ...d, size } : d)),
    })),

  updateDecalRotation: (id, rotation) =>
    set((state) => ({
      decals: state.decals.map((d) => (d.id === id ? { ...d, rotation } : d)),
    })),

  activeDecalId: null,
  setActiveDecalId: (id) => set({ activeDecalId: id }),

  mode: 'orbit',
  setMode: (mode) => set({ mode }),
  pendingSticker: null,
  setPendingSticker: (s) => set({ pendingSticker: s }),

  customStickers: [],
  addCustomSticker: (url, label) =>
    set((state) => ({
      customStickers: [...state.customStickers, { id: uuidv4(), url, label }],
    })),
  removeCustomSticker: (id) =>
    set((state) => ({
      customStickers: state.customStickers.filter((s) => s.id !== id),
    })),
}));
