import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface AppState {
  counter: number;
  todos: Todo[];
}

const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem("appState");
    if (saved) return JSON.parse(saved);
  } catch { }
  return { counter: 0, todos: [] };
};

const initialState: AppState = loadState();

export const AppSlice = createSlice({
  name: "AppSlice",
  initialState,
  reducers: {
    increment: (state) => {
      state.counter += 1;
    },
    decrement: (state) => {
      state.counter -= 1;
    },
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({ id: Date.now(), text: action.payload, completed: false });
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
    resetTodo: (state) => {
      state.counter = 0;
      state.todos = [];
    }
  },
});

export const { increment, decrement, addTodo, toggleTodo, removeTodo, resetTodo } = AppSlice.actions;
export type RootState = ReturnType<typeof import("./store").store.getState>;