import React, { useState, useRef } from 'react';
import { useEditorStore, CAR_CONFIGS } from '../store/useEditorStore';
import type { DecalItem } from '../store/useEditorStore';
import { HexColorPicker } from 'react-colorful';
import { STICKERS } from '../utils/textureUtils';
import {
  IconCar, IconPaint, IconSticker, IconLayers,
  IconUpload, IconTrash, IconChevronDown, IconCheck,
  IconImage, IconClose, IconSliders,
} from './Icons';

// ─── Design tokens ────────────────────────────────────────────────────────
// bg:     #0f1013   surface: #16181d   elevated: #1e2028
// border: rgba(255,255,255,0.07)
// text:   #d8dae6   muted: #6b6e80   label: #454759
// accent: #3b71f5

const PALETTE_COLORS = [
  '#dc2626','#ea580c','#d97706','#65a30d',
  '#059669','#0891b2','#2563eb','#7c3aed',
  '#db2777','#ffffff','#94a3b8','#1e293b',
];

// ─── Section wrapper ───────────────────────────────────────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-b border-[rgba(255,255,255,0.06)] ${className}`}>
      {children}
    </div>
  );
}

// ─── Section label ─────────────────────────────────────────────────────────
function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-4 pb-2">
      <span className="text-[#454759]">{icon}</span>
      <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#454759]">
        {children}
      </span>
    </div>
  );
}

// ─── Slider ────────────────────────────────────────────────────────────────
function PropSlider({ label, value, onChange, min = 0, max = 1, step = 0.01, format }: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number;
  format?: (v: number) => string;
}) {
  const display = format
    ? format(value)
    : max <= 1
    ? `${Math.round(value * 100)}%`
    : `${Math.round((value * 180) / Math.PI)}°`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] text-[#6b6e80]">{label}</span>
        <span className="text-[11px] text-[#d8dae6] tabular-nums font-medium">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider-pro w-full"
      />
    </div>
  );
}

// ─── Decal layer row ───────────────────────────────────────────────────────
function DecalRow({ decal }: { decal: DecalItem }) {
  const { activeDecalId, setActiveDecalId, removeDecal, updateDecalSize, updateDecalRotation } = useEditorStore();
  const isActive = activeDecalId === decal.id;
  const sticker = STICKERS.find(s => s.type === decal.type);

  return (
    <div
      className={`rounded-md transition-colors ${
        isActive ? 'bg-[rgba(59,113,245,0.12)] ring-1 ring-[rgba(59,113,245,0.35)]' : 'hover:bg-[#1e2028]'
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-3 py-2 cursor-pointer"
        onClick={() => setActiveDecalId(isActive ? null : decal.id)}
      >
        {/* Thumbnail */}
        <div className="w-7 h-7 rounded flex items-center justify-center bg-[#1e2028] flex-shrink-0 overflow-hidden">
          {decal.type === 'custom' && decal.customUrl ? (
            <img src={decal.customUrl} className="w-full h-full object-contain" alt="" />
          ) : (
            <span className="text-sm leading-none">{sticker?.emoji}</span>
          )}
        </div>

        <span className={`flex-1 text-[12px] font-medium truncate ${isActive ? 'text-[#d8dae6]' : 'text-[#8b8fa8]'}`}>
          {decal.label}
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); removeDecal(decal.id); }}
          className="w-6 h-6 rounded flex items-center justify-center text-[#454759] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
          title="Usuń"
        >
          <IconTrash size={12} />
        </button>
      </div>

      {/* Expanded controls */}
      {isActive && (
        <div className="px-3 pb-3 flex flex-col gap-3">
          <PropSlider
            label="Rozmiar"
            value={decal.size}
            onChange={(v) => updateDecalSize(decal.id, v)}
            min={0.05} max={2} step={0.01}
            format={(v) => `${(v * 100).toFixed(0)} u`}
          />
          <PropSlider
            label="Obrót"
            value={decal.rotation}
            onChange={(v) => updateDecalRotation(decal.id, v)}
            min={-Math.PI} max={Math.PI} step={0.05}
          />
        </div>
      )}
    </div>
  );
}

// ─── Custom sticker tile ───────────────────────────────────────────────────
function CustomTile({ item, active, onSelect }: {
  item: { id: string; url: string; label: string };
  active: boolean;
  onSelect: () => void;
}) {
  const { removeCustomSticker } = useEditorStore();
  return (
    <div className="relative group">
      <button
        onClick={onSelect}
        className={`w-full aspect-square rounded-md border overflow-hidden transition-all ${
          active
            ? 'border-[#3b71f5] ring-1 ring-[rgba(59,113,245,0.4)]'
            : 'border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)]'
        }`}
      >
        <img src={item.url} alt={item.label} className="w-full h-full object-contain bg-[#16181d] p-1" />
      </button>
      <button
        onClick={() => removeCustomSticker(item.id)}
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4444] text-white hidden group-hover:flex items-center justify-center shadow-lg"
      >
        <IconClose size={8} />
      </button>
    </div>
  );
}

// ─── Main Sidebar ──────────────────────────────────────────────────────────
export default function Sidebar() {
  const {
    selectedCarId, setSelectedCarId,
    paintColor, setPaintColor,
    metalness, setMetalness,
    roughness, setRoughness,
    decals,
    mode, setMode,
    pendingSticker, setPendingSticker,
    customStickers, addCustomSticker,
    activeDecalId,
  } = useEditorStore();

  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const currentDecals = decals.filter(d => d.carId === selectedCarId);

  const handleStickerClick = (type: typeof STICKERS[0]['type'], label: string) => {
    setPendingSticker({ type, label });
    setMode('place');
  };

  const handleCustomClick = (item: typeof customStickers[0]) => {
    setPendingSticker({ type: 'custom', label: item.label, customUrl: item.url });
    setMode('place');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const label = file.name.replace(/\.[^.]+$/, '').slice(0, 20);
    addCustomSticker(url, label);
    setPendingSticker({ type: 'custom', label, customUrl: url });
    setMode('place');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <aside
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      className="flex flex-col w-[268px] min-w-[268px] h-full bg-[#0f1013] border-r border-[rgba(255,255,255,0.07)] overflow-y-auto text-[#d8dae6] text-[13px]"
    >

      {/* ── Logobar ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(255,255,255,0.07)]">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#3b71f5,#7c3aed)' }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
            <path d="M10 2L3 7v6l7 5 7-5V7L10 2z" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[#d8dae6] leading-tight">WrapStudio</div>
          <div className="text-[10px] text-[#454759] leading-tight">Pro Edition</div>
        </div>
        <div className="ml-auto text-[10px] text-[#454759] bg-[#1e2028] px-1.5 py-0.5 rounded">v2</div>
      </div>

      {/* ── Vehicle ────────────────────────────────────────────── */}
      <Section>
        <SectionLabel icon={<IconCar size={13} />}>Pojazd</SectionLabel>
        <div className="px-3 pb-3 flex flex-col gap-1">
          {CAR_CONFIGS.map(car => {
            const active = selectedCarId === car.id;
            return (
              <button
                key={car.id}
                onClick={() => setSelectedCarId(car.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-left transition-colors ${
                  active
                    ? 'bg-[rgba(59,113,245,0.15)] text-[#d8dae6]'
                    : 'text-[#8b8fa8] hover:bg-[#16181d] hover:text-[#d8dae6]'
                }`}
              >
                {/* Car silhouette icon */}
                <div className={`w-10 h-8 flex items-center justify-center flex-shrink-0 rounded ${
                  active ? 'text-[#3b71f5]' : 'text-[#454759]'
                }`}>
                  <IconCar size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-[12px] font-semibold leading-tight ${active ? 'text-[#d8dae6]' : 'text-[#8b8fa8]'}`}>
                    {car.name}
                  </div>
                  <div className="text-[10px] text-[#454759] leading-tight mt-0.5">{car.subtitle}</div>
                </div>
                {active && (
                  <div className="w-4 h-4 rounded-full bg-[#3b71f5] flex items-center justify-center flex-shrink-0">
                    <IconCheck size={10} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Paint ──────────────────────────────────────────────── */}
      <Section>
        <SectionLabel icon={<IconPaint size={13} />}>Lakier</SectionLabel>
        <div className="px-3 pb-4 flex flex-col gap-3">

          {/* Color swatch button */}
          <button
            onClick={() => setColorPickerOpen(v => !v)}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md bg-[#16181d] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)] transition-colors"
          >
            <div
              className="w-6 h-6 rounded-sm ring-1 ring-[rgba(255,255,255,0.12)] flex-shrink-0"
              style={{ background: paintColor }}
            />
            <span className="text-[12px] font-mono text-[#8b8fa8]">{paintColor.toUpperCase()}</span>
            <span className="ml-auto text-[#454759]">
              <IconChevronDown size={13} />
            </span>
          </button>

          {/* Color picker */}
          {colorPickerOpen && (
            <div className="rounded-md overflow-hidden ring-1 ring-[rgba(255,255,255,0.08)]">
              <HexColorPicker color={paintColor} onChange={setPaintColor} style={{ width: '100%' }} />
            </div>
          )}

          {/* Preset palette */}
          <div className="grid grid-cols-6 gap-1.5">
            {PALETTE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setPaintColor(c)}
                className={`w-full aspect-square rounded-sm transition-transform hover:scale-110 ring-offset-[#0f1013] ${
                  paintColor === c ? 'ring-1 ring-[#3b71f5] ring-offset-[2px] scale-110' : ''
                }`}
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>

          {/* Material sliders */}
          <div className="flex flex-col gap-3 pt-1">
            <PropSlider label="Metaliczność" value={metalness} onChange={setMetalness} />
            <PropSlider label="Połysk" value={1 - roughness} onChange={(v) => setRoughness(1 - v)} />
          </div>
        </div>
      </Section>

      {/* ── Decals ─────────────────────────────────────────────── */}
      <Section>
        <SectionLabel icon={<IconSticker size={13} />}>Naklejki</SectionLabel>
        <div className="px-3 pb-4 flex flex-col gap-3">

          {/* Place-mode banner */}
          {mode === 'place' && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[rgba(234,179,8,0.08)] border border-[rgba(234,179,8,0.2)] text-[#ca8a04] text-[11px]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ca8a04] animate-pulse flex-shrink-0" />
              <span className="flex-1">Kliknij na karoserię auta</span>
              <button
                onClick={() => { setMode('orbit'); setPendingSticker(null); }}
                className="text-[#ca8a04] hover:text-[#eab308] flex-shrink-0"
              ><IconClose size={10} /></button>
            </div>
          )}

          {/* Sticker grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {STICKERS.map(s => {
              const isSelected = pendingSticker?.type === s.type && mode === 'place';
              return (
                <button
                  key={s.type}
                  onClick={() => handleStickerClick(s.type, s.label)}
                  title={s.label}
                  className={`flex flex-col items-center gap-1 rounded-md border transition-all py-2 px-1 ${
                    isSelected
                      ? 'bg-[rgba(59,113,245,0.15)] border-[rgba(59,113,245,0.5)]'
                      : 'bg-[#16181d] border-[rgba(255,255,255,0.07)] hover:bg-[#1e2028] hover:border-[rgba(255,255,255,0.13)]'
                  }`}
                >
                  <span className="text-xl leading-none">{s.emoji}</span>
                  <span className="text-[9px] text-[#454759] font-medium">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Upload section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#454759] uppercase tracking-[0.1em] font-semibold">
                Własne grafiki
              </span>
              <span className="text-[9px] text-[#2e3040]">PNG · JPG · WebP</span>
            </div>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md border border-dashed border-[rgba(255,255,255,0.1)] hover:border-[rgba(59,113,245,0.5)] hover:bg-[rgba(59,113,245,0.04)] transition-colors text-[#454759] hover:text-[#3b71f5]"
            >
              <IconUpload size={14} />
              <span className="text-[11px] font-medium">Wgraj plik / logo</span>
            </button>

            {customStickers.length > 0 && (
              <div className="grid grid-cols-5 gap-1.5 mt-0.5">
                {customStickers.map(item => (
                  <CustomTile
                    key={item.id}
                    item={item}
                    active={pendingSticker?.customUrl === item.url && mode === 'place'}
                    onSelect={() => handleCustomClick(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ── Layers ─────────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-4 flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-1 mb-1">
          <span className="text-[#454759]"><IconLayers size={13} /></span>
          <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#454759] flex-1">
            Warstwy
          </span>
          {currentDecals.length > 0 && (
            <span className="text-[10px] font-semibold text-[#2e3040] bg-[#16181d] w-5 h-5 rounded flex items-center justify-center">
              {currentDecals.length}
            </span>
          )}
        </div>

        {currentDecals.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 py-6 px-2">
            <div className="w-10 h-10 rounded-full bg-[#16181d] flex items-center justify-center text-[#2e3040]">
              <IconLayers size={20} />
            </div>
            <p className="text-[11px] text-[#2e3040] text-center leading-relaxed">
              Brak naklejek.<br />
              Wybierz grafikę i kliknij<br />na karoserię.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {[...currentDecals].reverse().map(d => (
              <DecalRow key={d.id} decal={d} />
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-4 py-2 border-t border-[rgba(255,255,255,0.05)] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
        <span className="text-[10px] text-[#2e3040]">Three.js · DecalGeometry</span>
        <span className="ml-auto text-[10px] text-[#2e3040]">
          {currentDecals.length} decal{currentDecals.length !== 1 ? 's' : ''}
        </span>
      </div>
    </aside>
  );
}
