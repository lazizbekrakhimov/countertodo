const DISC = 500;

interface VinylDiscProps {
    playing: boolean;
    onToggle: () => void;
}

const VinylDisc = ({ playing, onToggle }: VinylDiscProps) => (
    <div style={{ position: "relative", width: DISC, height: DISC }}>

        <div style={{
            position: "absolute", inset: -20, borderRadius: "50%",
            border: "1px solid rgba(34,211,238,0.18)",
            boxShadow: "0 0 50px rgba(34,211,238,0.2), 0 0 110px rgba(34,211,238,0.08)",
            animation: playing ? "ringPulse 3s ease-in-out infinite" : "none",
            opacity: playing ? 1 : 0.3,
            transition: "opacity 0.6s ease",
            pointerEvents: "none", zIndex: 0,
        }} />

        {/* Spinning disc */}
        <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            overflow: "hidden",
            animation: playing ? "discSpin 4s linear infinite" : "none",
            background: "radial-gradient(circle at 50% 50%, #1c1a2e 0%, #0d0b1b 55%, #07060e 100%)",
            boxShadow: "0 0 0 4px #0f0e1a, 0 0 90px rgba(0,0,0,0.98), 0 0 130px rgba(139,92,246,0.14)",
            transition: "filter 0.5s ease",
            filter: playing ? "none" : "brightness(0.6) saturate(0.5)",
            zIndex: 1,
        }}>
            <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: `repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 9px, rgba(255,255,255,0.048) 10px, rgba(0,0,0,0.22) 11px, transparent 12px)`,
            }} />
            <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: `conic-gradient(from 0deg at 30% 28%, rgba(255,255,255,0.15) 0deg, transparent 60deg, transparent 175deg, rgba(255,255,255,0.06) 185deg, transparent 230deg, transparent 360deg)`,
                mixBlendMode: "screen",
            }} />
        </div>

        {/* Label — sibling, never spins */}
        <div style={{
            position: "absolute",
            width: "36%", height: "36%",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 30%, #201d42, #0c0a22)",
            border: "1.5px solid rgba(139,92,246,0.6)",
            boxShadow: "0 0 0 3px rgba(139,92,246,0.1), 0 0 24px rgba(139,92,246,0.5), inset 0 0 20px rgba(0,0,0,0.7)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 2,
            zIndex: 3,
            pointerEvents: "none",
            transition: "filter 0.5s ease",
            filter: playing ? "none" : "brightness(0.5)",
        }}>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.9rem", color: "rgba(139,92,246,0.6)", letterSpacing: "0.18em" }}>2026</span>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "#22d3ee", letterSpacing: "0.04em", textShadow: "0 0 8px rgba(34,211,238,1)" }}>LAZIZBEK</span>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "rgba(167,139,250,0.95)", letterSpacing: "0.04em" }}>RAHIMOV</span>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "1rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>PROJECT</span>
        </div>

        {/* Spindle */}
        <div style={{
            position: "absolute", width: 11, height: 11,
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #555, #060406)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
            zIndex: 4,
        }} />

        {/* Tonearm SVG */}
        <svg
            viewBox={`-100 -20 ${DISC} ${DISC}`}
            style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                overflow: "visible", pointerEvents: "none", zIndex: 5,
                transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1)",
                transform: playing ? "rotate(0deg)" : "rotate(-16deg)",
                transformOrigin: "600px 0",
            }}
        >
            <defs>
                <linearGradient id="armGrad" x1="610" y1="-10" x2="610" y2="215" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <radialGradient id="pivotGrad" cx="35%" cy="30%">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#0e7490" />
                </radialGradient>
            </defs>
            <line x1="510" y1="-10" x2="310" y2="338"
                stroke="url(#armGrad)" strokeWidth="15" strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 4px rgba(34,211,238,0.6))" }} />
            <line x1="310" y1="338" x2="296" y2="366"
                stroke="#8b5cf6" strokeWidth="11" strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 4px rgba(139,92,246,0.7))" }} />
            <rect x="287.5" y="366" width="18" height="28" rx="3"
                fill="#22d3ee"
                style={{ filter: "drop-shadow(0 0 7px rgba(34,211,238,1))" }} />
            <polygon
                points="294,394 300,394 297,400"
                fill="rgba(255,255,255)"
                style={{ filter: "drop-shadow(0 0 4px rgba(34,211,238,0.9))" }}
            />
            <circle cx="510" cy="-10" r="26"
                fill="url(#pivotGrad)"
                style={{ filter: "drop-shadow(0 0 12px rgba(34,211,238,0.8))" }} />
            <circle cx="510" cy="-10" r="10" fill="#083344" />
            <circle cx="510" cy="-10" r="5" fill="#22d3ee"
                style={{ filter: "drop-shadow(0 0 4px #22d3ee)" }} />
        </svg>

        {/* Power switch */}
        <div
            onClick={onToggle}
            style={{
                position: "absolute", bottom: -30, right: -145,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                zIndex: 2, cursor: "pointer",
            }}
        >
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(34,211,238,0.55)" }}>OFF</span>
            <div style={{
                width: 48, height: 92, borderRadius: 12,
                background: "linear-gradient(180deg, #111827, #0a0d14)",
                border: `1px solid ${playing ? "rgba(34,211,238,0.45)" : "rgba(34,211,238,0.18)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: playing
                    ? "0 0 24px rgba(34,211,238,0.25), inset 0 0 16px rgba(0,0,0,0.7)"
                    : "0 0 8px rgba(34,211,238,0.05), inset 0 0 16px rgba(0,0,0,0.7)",
                transition: "all 0.4s ease",
            }}>
                <div style={{
                    width: 26, height: 44, borderRadius: 7,
                    background: playing
                        ? "linear-gradient(180deg, #f87171 0%, #b91c1c 50%, #f87171 100%)"
                        : "linear-gradient(180deg, #4b5563 0%, #1f2937 50%, #4b5563 100%)",
                    transform: playing ? "translateY(12px)" : "translateY(-12px)",
                    boxShadow: playing
                        ? "0 0 16px rgba(239,68,68,0.65), inset 0 1px 2px rgba(255,255,255,0.2)"
                        : "0 0 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.05)",
                    transition: "all 0.4s ease",
                    position: "relative", overflow: "hidden",
                }}>
                    <div style={{ position: "absolute", top: 5, left: 5, width: 7, height: 14, borderRadius: 3, background: "rgba(255,255,255,0.22)" }} />
                </div>
            </div>
            <span style={{
                fontFamily: "'Orbitron',sans-serif", fontSize: "0.5rem", letterSpacing: "0.2em",
                color: "rgba(239,68,68,0.8)",
                transition: "color 0.4s ease",
            }}>POWER</span>
        </div>

    </div>
);

export default VinylDisc;