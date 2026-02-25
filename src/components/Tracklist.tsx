import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, toggleTodo, removeTodo } from "../store/AppSlice";
import type { RootState } from "../store/store";

const Tracklist = () => {
    const todos = useSelector((state: RootState) => state.todos);
    const dispatch = useDispatch();
    const [input, setInput] = useState("");

    const handleAdd = () => {
        if (input.trim()) { dispatch(addTodo(input.trim())); setInput(""); }
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-md"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07),0 0 30px rgba(139,92,246,0.04)" }}>
            <p className="mb-4 text-xs tracking-[0.25em] text-violet-400/70 uppercase">● Tracklist</p>

            <div className="mb-4 flex gap-2">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAdd()}
                    placeholder="Add a track..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-cyan-400/50 focus:shadow-[0_0_12px_rgba(34,211,238,0.15)]" />
                <button
                    onClick={handleAdd}
                    className="rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-5 py-2.5 text-xs font-semibold tracking-[0.15em] text-cyan-300 uppercase transition-all cursor-pointer hover:bg-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_0_16px_rgba(34,211,238,0.4)] active:scale-95" >ADD</button>
            </div>

            <ul className="flex max-h-47.5 min-h-15 flex-col gap-2 overflow-y-auto pr-1
                     [&::-webkit-scrollbar]:w-0.5
                     [&::-webkit-scrollbar-thumb]:rounded-full
                     [&::-webkit-scrollbar-thumb]:bg-cyan-400/30">
                {todos.length === 0 && (
                    <li className="py-5 text-center text-xs italic text-white/25">No tracks yet. Drop a needle…</li>
                )}
                {todos.map((todo, idx) => (
                    <li
                        key={todo.id}
                        className={`group flex items-center gap-3 rounded-xl border px-3 py-3 transition-all
                        ${todo.completed
                                ? "border-white/5 bg-white/2 opacity-40"
                                : "border-white/8 bg-white/4 hover:border-cyan-400/25 hover:bg-cyan-400/5"}`}
                    >
                        <button
                            onClick={() => dispatch(toggleTodo(todo.id))}
                            className="flex h-6 w-6 shrink-0 items-center justify-center cursor-pointer rounded-md border transition-all"
                            style={{
                                borderColor: todo.completed ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.15)",
                                background: todo.completed ? "rgba(34,211,238,0.15)" : "transparent",
                            }}
                        >
                            {todo.completed && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>

                        <span className="min-w-5.5 text-[11px] font-bold text-cyan-400/60"
                            style={{ fontFamily: "'Orbitron',sans-serif" }}>
                            {String(idx + 1).padStart(2, "0")}
                        </span>

                        <span className={`flex-1 select-none text-sm ${todo.completed ? "line-through text-white/40" : "text-white/85"}`}>
                            {todo.text}
                        </span>

                        <button onClick={() => dispatch(removeTodo(todo.id))} className="flex h-8 w-8 pl-0.5 shrink-0 items-center justify-center rounded-lg border border-red-500/20  bg-red-500/10 text-red-400/60 transition-all duration-200 cursor-pointer hover:bg-red-500/25 hover:border-red-400 hover:text-red-400  hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]"  >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tracklist;