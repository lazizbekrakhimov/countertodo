import { useState, useEffect } from "react";
import { Counter, Tracklist, VinylDisc, Wavebg } from "./components";

export default function App() {
  const [playing, setPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace" }}
      className="relative min-h-screen overflow-hidden bg-[#050810] text-white">

      <Wavebg playing={playing} />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]" style={{
        backgroundImage: "linear-gradient(rgba(34,211,238,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.4) 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      <div className="pointer-events-none fixed rounded-full bg-cyan-500/10 blur-[130px]"
        style={{ width: 600, height: 600, top: -200, left: -180 }} />
      <div className="pointer-events-none fixed rounded-full bg-violet-600/10 blur-[110px]"
        style={{ width: 550, height: 550, bottom: -120, right: -120 }} />

      <div className="relative z-10 flex min-h-screen items-center justify-center gap-25 px-30">
        <div
          className="flex w-95 shrink-0 flex-col gap-5"
          style={{
            marginRight: 60,
            transform: mounted ? "translateY(0)" : "translateY(60px)",
            opacity: mounted ? 1 : 0,
            transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.8s ease",
          }}
        >
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-5 py-2">
            <span className={`h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] ${playing ? "animate-pulse" : ""}`} />
            <span className="text-xs tracking-[0.3em] text-cyan-300 uppercase"
              style={{ fontFamily: "'Orbitron',sans-serif" }}>ACTIVE</span>
          </div>

          <h1 className="text-5xl font-black leading-none"
            style={{ fontFamily: "'Orbitron',sans-serif", textShadow: "0 0 40px rgba(34,211,238,0.35)" }}>
            VINYL<br /><span className="text-cyan-400">PLAYER CT</span>
          </h1>

          <Counter />
          <Tracklist />
        </div>

        <div
          className="flex items-center justify-center"
          style={{
            paddingRight: 125,
            paddingTop: 35,
            transform: mounted ? "translateY(0)" : "translateY(-70px)",
            opacity: mounted ? 1 : 0,
            transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1), opacity 0.9s ease",
            transitionDelay: "0.1s",
          }}
        >
          <VinylDisc playing={playing} onToggle={() => setPlaying(p => !p)} />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

        @keyframes discSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ringPulse {
          0%,100% { opacity:0.65; transform:scale(1); }
          50%     { opacity:1;    transform:scale(1.012); }
        }
      `}</style>
    </div>
  );
}