import { useEffect, useRef } from "react";

interface WaveBgProps {
  playing: boolean;
}

const WAVE_CONFIG = {
  // Umumiy tezlik: 0.01 = juda sekin | 0.12 = normal | 0.4 = tez
  speed:      0.05,

  // To'lqin balandligi: 0.3 = past | 1.0 = normal | 2.0 = baland
  amplitude:  2.0,

  // Shakl murakkabligi (warp): 0.0 = sof | 0.6 = normal | 1.5 = g'aliz
  warp:       0.0,

  // Glow kuchi: 0.0 = yo'q | 0.55 = normal | 1.0 = kuchli
  glowAlpha:  0.55,

  // Gorizont joylashuvi: 0.1 = yuqori | 0.32 = normal | 0.6 = pastda
  horizon:    0.32,

  // Play/pause o'tish silliqlik: 0.005 = sust | 0.015 = normal | 0.05 = tez
  easing:     0.05,
};

/* ─── Value noise ─────────────────────────────────────────── */
function vnoise(x: number, seed: number): number {
  const i  = Math.floor(x);
  const f  = x - i;
  const u  = f * f * f * (f * (f * 6 - 15) + 10);
  const r0 = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453123;
  const r1 = Math.sin((i + 1) * 127.1 + seed * 311.7) * 43758.5453123;
  return (r0 - Math.floor(r0)) * (1 - u) + (r1 - Math.floor(r1)) * u;
}

/* ─── fBm 5 octaves ───────────────────────────────────────── */
function fbm(x: number, seed: number): number {
  let v = 0, a = 0.5, f = 1.0, norm = 0;
  for (let i = 0; i < 5; i++) {
    v    += vnoise(x * f, seed + i * 13) * a;
    norm += a;
    a    *= 0.48;
    f    *= 2.13;
  }
  return (v / norm) * 2 - 1;
}

/* ─── Domain-warped fBm ───────────────────────────────────── */
function warpedFbm(x: number, t: number, seed: number): number {
  const w = fbm(x * 0.4 + t * 0.03, seed + 200) * WAVE_CONFIG.warp;
  return fbm(x + w, seed);
}

/* ─── Perspective scale ───────────────────────────────────── */
function perspScale(depth: number): number {
  return 0.3 + depth * 0.7;
}

const WaveBg = ({ playing }: WaveBgProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const timeRef   = useRef(0);
  const speedRef  = useRef(playing ? 1 : 0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const Y_HORIZON = WAVE_CONFIG.horizon;

    interface Layer {
      depth: number;
      amp: number;
      noiseFreq: number;
      noiseSpeed: number;
      sinFreq: number;
      sinSpeed: number;
      seed: number;
      color: string;
      isGlow: boolean;
    }

    const layers: Layer[] = [
      // ── Far ──
      { depth: 0.05, amp: 3,  noiseFreq: 0.0003, noiseSpeed: 0.018, sinFreq: 0.0005, sinSpeed: 0.022, seed: 1,  color: "34,211,238",  isGlow: false },
      { depth: 0.10, amp: 4,  noiseFreq: 0.0004, noiseSpeed: 0.022, sinFreq: 0.0006, sinSpeed: 0.026, seed: 7,  color: "139,92,246",  isGlow: false },
      { depth: 0.18, amp: 6,  noiseFreq: 0.0005, noiseSpeed: 0.026, sinFreq: 0.0008, sinSpeed: 0.030, seed: 13, color: "34,211,238",  isGlow: false },
      { depth: 0.25, amp: 8,  noiseFreq: 0.0006, noiseSpeed: 0.030, sinFreq: 0.0010, sinSpeed: 0.034, seed: 19, color: "167,139,250", isGlow: false },
      // ── Mid ──
      { depth: 0.35, amp: 11, noiseFreq: 0.0007, noiseSpeed: 0.036, sinFreq: 0.0013, sinSpeed: 0.040, seed: 29, color: "34,211,238",  isGlow: true  },
      { depth: 0.42, amp: 13, noiseFreq: 0.0008, noiseSpeed: 0.042, sinFreq: 0.0015, sinSpeed: 0.046, seed: 37, color: "139,92,246",  isGlow: false },
      { depth: 0.50, amp: 16, noiseFreq: 0.0009, noiseSpeed: 0.048, sinFreq: 0.0017, sinSpeed: 0.052, seed: 43, color: "34,211,238",  isGlow: true  },
      { depth: 0.58, amp: 19, noiseFreq: 0.0010, noiseSpeed: 0.055, sinFreq: 0.0019, sinSpeed: 0.058, seed: 53, color: "167,139,250", isGlow: false },
      // ── Near ──
      { depth: 0.68, amp: 22, noiseFreq: 0.0011, noiseSpeed: 0.062, sinFreq: 0.0021, sinSpeed: 0.066, seed: 61, color: "34,211,238",  isGlow: true  },
      { depth: 0.76, amp: 26, noiseFreq: 0.0012, noiseSpeed: 0.070, sinFreq: 0.0023, sinSpeed: 0.074, seed: 71, color: "139,92,246",  isGlow: false },
      { depth: 0.85, amp: 30, noiseFreq: 0.0013, noiseSpeed: 0.078, sinFreq: 0.0025, sinSpeed: 0.082, seed: 79, color: "34,211,238",  isGlow: true  },
      { depth: 0.93, amp: 34, noiseFreq: 0.0014, noiseSpeed: 0.086, sinFreq: 0.0027, sinSpeed: 0.090, seed: 89, color: "167,139,250", isGlow: false },
      { depth: 1.00, amp: 38, noiseFreq: 0.0015, noiseSpeed: 0.095, sinFreq: 0.0029, sinSpeed: 0.100, seed: 97, color: "34,211,238",  isGlow: true  },
    ];

    /* ─── Build Y values ──────────────────────────────────── */
    const buildY = (layer: Layer, t: number, W: number, H: number): Float32Array => {
      const ps  = perspScale(layer.depth);
      // amplitude multiplied by global WAVE_CONFIG.amplitude
      const amp = layer.amp * ps * WAVE_CONFIG.amplitude;
      const step = 4;
      const len  = Math.ceil(W / step) + 2;
      const ys   = new Float32Array(len);
      const yCenter = H * (Y_HORIZON + layer.depth * (1 - Y_HORIZON) * 0.92);

      for (let xi = 0; xi < len; xi++) {
        const x = xi * step;
        // noiseSpeed & sinSpeed multiplied by global WAVE_CONFIG.speed
        const nx    = x * layer.noiseFreq + t * layer.noiseSpeed * WAVE_CONFIG.speed * 8;
        const noise = warpedFbm(nx, t, layer.seed);
        const s1    = Math.sin(x * layer.sinFreq  + t * layer.sinSpeed  * WAVE_CONFIG.speed * 8);
        const s2    = Math.sin(x * layer.sinFreq * 1.618 + t * layer.sinSpeed * 1.3 * WAVE_CONFIG.speed * 8 + 2.4);
        const s3    = Math.sin(x * layer.sinFreq * 0.5   - t * layer.sinSpeed * 0.7 * WAVE_CONFIG.speed * 8 + 4.2);
        const env   = 0.6 + 0.4 * vnoise(x * 0.0002 + t * 0.03, layer.seed + 500);
        const yOff  = (noise * 0.45 + s1 * 0.30 + s2 * 0.15 + s3 * 0.10) * amp * env;
        ys[xi] = yCenter + yOff;
      }
      return ys;
    };

    /* ─── Draw layer ──────────────────────────────────────── */
    const drawLayer = (
      layer: Layer,
      ys: Float32Array,
      W: number,
      H: number,
      alpha: number,
      blur: number
    ) => {
      const step = 4;
      const ps   = perspScale(layer.depth);

      ctx.save();
      if (blur > 0) ctx.filter = `blur(${blur}px)`;

      // Fill
      if (layer.depth > 0.3) {
        ctx.beginPath();
        ctx.moveTo(0, ys[0]);
        for (let xi = 1; xi < ys.length - 1; xi++) {
          const x0 = (xi - 1) * step, y0 = ys[xi - 1];
          const x1 =  xi      * step, y1 = ys[xi];
          ctx.quadraticCurveTo(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        }
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        const fillAlpha = alpha * ps * 0.18;
        const mid = ys[Math.floor(ys.length / 2)];
        const grad = ctx.createLinearGradient(0, mid - 20, 0, H);
        grad.addColorStop(0, `rgba(${layer.color},${fillAlpha.toFixed(3)})`);
        grad.addColorStop(1, `rgba(${layer.color},0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Stroke
      ctx.beginPath();
      ctx.moveTo(0, ys[0]);
      for (let xi = 1; xi < ys.length - 1; xi++) {
        const x0 = (xi - 1) * step, y0 = ys[xi - 1];
        const x1 =  xi      * step, y1 = ys[xi];
        ctx.quadraticCurveTo(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      }
      ctx.lineTo(W, ys[ys.length - 1]);
      const strokeAlpha = (0.06 + layer.depth * 0.22) * alpha;
      ctx.strokeStyle = `rgba(${layer.color},${strokeAlpha.toFixed(3)})`;
      ctx.lineWidth   = 0.5 + ps * 2.0;
      ctx.stroke();

      // Foam dots
      if (layer.depth > 0.55 && blur === 0) {
        const ampVal = layer.amp * ps * WAVE_CONFIG.amplitude;
        for (let xi = 2; xi < ys.length - 2; xi++) {
          if (ys[xi] < ys[xi - 1] && ys[xi] < ys[xi + 1]) {
            const prom = Math.min(ys[xi - 1], ys[xi + 1]) - ys[xi];
            if (prom > ampVal * 0.15 && Math.random() < 0.08) {
              ctx.beginPath();
              ctx.arc(xi * step, ys[xi], 0.8 + ps * 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${layer.color},${(0.3 + Math.random() * 0.3).toFixed(2)})`;
              ctx.fill();
            }
          }
        }
      }

      ctx.restore();
    };

    /* ─── Main loop ───────────────────────────────────────── */
    const draw = () => {
      const target = playing ? 1 : 0;
      speedRef.current += (target - speedRef.current) * WAVE_CONFIG.easing;
      // timeRef sadece 1 birim/frame oshadi — tezlik buildY ichida WAVE_CONFIG.speed orqali
      timeRef.current  += speedRef.current;

      const t = timeRef.current;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      for (const layer of layers) {
        const ys = buildY(layer, t, W, H);
        if (layer.isGlow) {
          drawLayer(layer, ys, W, H, WAVE_CONFIG.glowAlpha, 8);
          drawLayer(layer, ys, W, H, WAVE_CONFIG.glowAlpha * 0.6, 18);
        }
        drawLayer(layer, ys, W, H, 1.0, 0);
      }

      // Horizon shimmer
      const shimY = H * Y_HORIZON;
      const shimGrad = ctx.createLinearGradient(0, shimY - 2, 0, shimY + 6);
      shimGrad.addColorStop(0,   "rgba(34,211,238,0.0)");
      shimGrad.addColorStop(0.5, `rgba(34,211,238,${(0.04 + 0.03 * Math.sin(t * 0.3)).toFixed(3)})`);
      shimGrad.addColorStop(1,   "rgba(34,211,238,0.0)");
      ctx.fillStyle = shimGrad;
      ctx.fillRect(0, shimY - 2, W, 8);

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [playing]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
};

export default WaveBg;