import * as THREE from 'three';
import type { StickerType } from '../store/useEditorStore';

const cache = new Map<string, THREE.CanvasTexture>();
const SIZE = 512;

function ctx2d(canvas: HTMLCanvasElement) {
  return canvas.getContext('2d')!;
}

function makeCanvas() {
  const c = document.createElement('canvas');
  c.width = SIZE;
  c.height = SIZE;
  return c;
}

function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, SIZE, SIZE);
}

// ── Icons / Graphics ───────────────────────────────────────────────────────

function drawStar(ctx: CanvasRenderingContext2D) {
  const cx = SIZE / 2, cy = SIZE / 2, outer = 220, inner = 90, pts = 5;
  ctx.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / pts) * i - Math.PI / 2;
    ctx[i === 0 ? 'moveTo' : 'lineTo'](cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  ctx.closePath();
  const grad = ctx.createRadialGradient(cx, cy - 40, 10, cx, cy, outer);
  grad.addColorStop(0, '#fff176'); grad.addColorStop(0.5, '#ffd600'); grad.addColorStop(1, '#ff8f00');
  ctx.fillStyle = grad; ctx.fill();
  ctx.strokeStyle = '#e65100'; ctx.lineWidth = 8; ctx.stroke();
}

function drawFlame(ctx: CanvasRenderingContext2D) {
  const cx = SIZE / 2;
  const gradO = ctx.createLinearGradient(cx, 480, cx, 20);
  gradO.addColorStop(0, '#ff1744'); gradO.addColorStop(0.4, '#ff6d00'); gradO.addColorStop(0.8, '#ffea00'); gradO.addColorStop(1, '#ffffff');
  ctx.fillStyle = gradO; ctx.beginPath(); ctx.moveTo(cx, 480);
  ctx.bezierCurveTo(80, 420, 20, 320, 80, 220); ctx.bezierCurveTo(100, 170, 60, 100, 100, 40);
  ctx.bezierCurveTo(110, 120, 150, 140, 160, 200); ctx.bezierCurveTo(175, 140, 200, 80, 230, 30);
  ctx.bezierCurveTo(260, 100, 240, 160, 250, 210); ctx.bezierCurveTo(290, 150, 320, 100, 350, 40);
  ctx.bezierCurveTo(395, 100, 360, 180, 400, 230); ctx.bezierCurveTo(460, 330, 430, 420, cx, 480);
  ctx.closePath(); ctx.fill();
}

function drawRacing(ctx: CanvasRenderingContext2D) {
  const sq = SIZE / 8;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#ffffff' : '#111111';
      ctx.fillRect(col * sq, row * sq, sq, sq);
    }
  }
  ctx.fillStyle = '#e53935'; ctx.beginPath();
  ctx.moveTo(0, SIZE * 0.55); ctx.lineTo(SIZE * 0.55, 0); ctx.lineTo(SIZE, 0); ctx.lineTo(SIZE * 0.45, SIZE); ctx.lineTo(0, SIZE);
  ctx.closePath(); ctx.fill();
}

function drawLightning(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(SIZE / 2, 20, SIZE / 2, SIZE - 20);
  grad.addColorStop(0, '#fff176'); grad.addColorStop(0.5, '#ffca28'); grad.addColorStop(1, '#ff8f00');
  ctx.fillStyle = grad; ctx.beginPath();
  ctx.moveTo(300, 20); ctx.lineTo(150, 270); ctx.lineTo(240, 270); ctx.lineTo(100, 490);
  ctx.lineTo(390, 220); ctx.lineTo(290, 220); ctx.lineTo(400, 20);
  ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#e65100'; ctx.lineWidth = 6; ctx.stroke();
}

function drawSkull(ctx: CanvasRenderingContext2D) {
  const cx = SIZE / 2, cy = SIZE * 0.42;
  const cGrad = ctx.createRadialGradient(cx - 20, cy - 30, 10, cx, cy, 190);
  cGrad.addColorStop(0, '#ffffff'); cGrad.addColorStop(1, '#bdbdbd');
  ctx.fillStyle = cGrad; ctx.beginPath(); ctx.ellipse(cx, cy, 185, 175, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#555'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#e0e0e0'; ctx.beginPath(); ctx.roundRect(cx - 115, cy + 110, 230, 100, [0, 0, 40, 40]); ctx.fill();
  ctx.stroke();
  [cx - 65, cx + 65].forEach(ex => {
    ctx.fillStyle = '#1a1a2e'; ctx.beginPath(); ctx.ellipse(ex, cy - 10, 55, 60, 0, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = '#1a1a2e'; ctx.beginPath(); ctx.moveTo(cx, cy + 55); ctx.lineTo(cx - 22, cy + 90); ctx.lineTo(cx + 22, cy + 90); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffffff'; const teethX = [cx - 95, cx - 55, cx - 18, cx + 18, cx + 55];
  teethX.forEach(tx => {
    ctx.beginPath(); ctx.roundRect(tx, cy + 118, 32, 52, [0, 0, 8, 8]); ctx.fill();
    ctx.strokeStyle = '#9e9e9e'; ctx.lineWidth = 2; ctx.stroke();
  });
}

function drawStripes(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, SIZE, SIZE);
  const colors = ['#e53935', '#ffffff', '#e53935'], widths = [0.2, 0.15, 0.2];
  let x = (SIZE - SIZE * widths.reduce((a, b) => a + b, 0)) / 2;
  colors.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(x, 0, SIZE * widths[i], SIZE); x += SIZE * widths[i]; });
}

function drawNumber42(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#1a1a2e'; ctx.beginPath(); ctx.roundRect(20, 20, SIZE - 40, SIZE - 40, 30); ctx.fill();
  ctx.strokeStyle = '#e53935'; ctx.lineWidth = 12; ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 280px "Arial Black", Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('42', SIZE / 2, SIZE / 2);
  ctx.fillStyle = '#e53935'; ctx.fillRect(60, SIZE - 90, SIZE - 120, 16);
}

// ── Basic Shapes ───────────────────────────────────────────────────────────

function drawCircle(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(SIZE/2, SIZE/2, SIZE/2 - 10, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

function drawSquare(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(10, 10, SIZE-20, SIZE-20, 24);
  ctx.fill();
}

function drawTriangle(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(SIZE/2, 20);
  ctx.lineTo(SIZE-20, SIZE-20);
  ctx.lineTo(20, SIZE-20);
  ctx.closePath();
  ctx.fill();
}

function drawLineLine(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(SIZE/2 - 40, 0, 80, SIZE);
}

function drawLineDiagonal(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, 80);
  ctx.lineTo(80, 0);
  ctx.lineTo(SIZE, SIZE-80);
  ctx.lineTo(SIZE-80, SIZE);
  ctx.closePath();
  ctx.fill();
}


// ── Factory ────────────────────────────────────────────────────────────────
export function getStickerTexture(type: StickerType): THREE.CanvasTexture {
  if (cache.has(type)) return cache.get(type)!;

  const canvas = makeCanvas();
  const ctx = ctx2d(canvas);
  clearCanvas(ctx);

  switch (type) {
    case 'star':        drawStar(ctx);      break;
    case 'flame':       drawFlame(ctx);     break;
    case 'racing':      drawRacing(ctx);    break;
    case 'lightning':   drawLightning(ctx); break;
    case 'skull':       drawSkull(ctx);     break;
    case 'stripes':     drawStripes(ctx);   break;
    case 'number42':    drawNumber42(ctx);  break;
    
    // basic shapes
    case 'circle':      drawCircle(ctx);    break;
    case 'square':      drawSquare(ctx);    break;
    case 'triangle':    drawTriangle(ctx);  break;
    case 'line_straight': drawLineLine(ctx); break;
    case 'line_diagonal': drawLineDiagonal(ctx); break;
    
    default:            drawCircle(ctx);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  cache.set(type, tex);
  return tex;
}

export const STICKERS: { type: StickerType; label: string; emoji: string }[] = [
  // Graphics
  { type: 'star',      label: 'Star',      emoji: '⭐' },
  { type: 'flame',     label: 'Flame',     emoji: '🔥' },
  { type: 'racing',    label: 'Checkered', emoji: '🏁' },
  { type: 'lightning', label: 'Lightning', emoji: '⚡' },
  { type: 'skull',     label: 'Skull',     emoji: '💀' },
  { type: 'stripes',   label: 'Stripes',   emoji: '🎽' },
  { type: 'number42',  label: '#42',       emoji: '4️⃣2️⃣' },
  
  // Shapes
  { type: 'circle',        label: 'Circle',   emoji: '⏺️' },
  { type: 'square',        label: 'Square',   emoji: '⏹️' },
  { type: 'triangle',      label: 'Triangle', emoji: '🔼' },
  { type: 'line_straight', label: 'Line',     emoji: '➖' },
  { type: 'line_diagonal', label: 'Diagonal', emoji: '➗' },
];
