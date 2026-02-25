import { useDispatch, useSelector } from "react-redux";
import { increment, decrement, resetTodo } from "../store/AppSlice";
import type { RootState } from "../store/store";

const Counter = () => {
    const counter = useSelector((state: RootState) => state.counter);
    const dispatch = useDispatch();

    return (
        <div
            className="rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-md"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07),0 0 30px rgba(34,211,238,0.04)" }}
        >
            <p className="mb-4 text-xs tracking-[0.25em] text-cyan-400/70 uppercase">
                ● Counter
            </p>
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={() => counter > 0 && dispatch(decrement())}
                    className={`flex h-14 w-14 items-center justify-center rounded-xl border text-3xl transition-all active:scale-95
                        ${counter === 0
                            ? "border-[rgba(139,92,246,0.15)] bg-[rgba(139,92,246,0.15)] text-[rgba(139,92,246,0.15)] cursor-pointer"
                            : "border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/25 hover:border-purple-400 hover:shadow-[0_0_16px_rgba(34,211,238,0.4)] cursor-pointer"
                        }`}
                >
                    −
                </button>
                <div className="flex flex-col items-center">
                    <span
                        className="text-7xl font-black leading-none"
                        style={{
                            fontFamily: "'Orbitron',sans-serif",
                            textShadow: "0 0 30px rgba(34,211,238,0.6)",
                        }}
                    >
                        {String(counter).padStart(2, "0")}
                    </span>
                    <span className="mt-1 text-[10px] tracking-[0.4em] text-white/40 uppercase">
                        plays
                    </span>
                </div>

                <button onClick={() => dispatch(increment())} className="flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-3xl text-cyan-300 transition-all cursor-pointer hover:bg-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_0_16px_rgba(34,211,238,0.4)] active:scale-95">
                    +
                </button>
            </div>

            <button onClick={() => dispatch(resetTodo())} className="mt-4 w-full rounded-xl border border-purple-500/30 bg-purple-500/10 py-3 text-xs tracking-widest text-purple-300 transition-all  hover:bg-purple-500/25 hover:border-purple-400 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)] cursor-pointer active:scale-95">
                RESET
            </button>
        </div>
    );
};

export default Counter;