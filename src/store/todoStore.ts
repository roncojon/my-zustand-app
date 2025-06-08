// src/store/todoStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      (set, get) => ({
        // --- INITIAL STATE ---
        todos: [],
        filter: 'all',
        isLoading: false,
        error: null,

        // --- ACTIONS IMPLEMENTATION ---

        fetchTodos: async () => {
          set({ isLoading: true, error: null })
          try {
            const fetched: Todo[] = await new Promise((resolve) =>
              setTimeout(
                () =>
                  resolve([
                    { id: 1, text: 'Learn Zustand', completed: false },
                    { id: 2, text: 'Build a real-world app', completed: true },
                  ]),
                1000,
              ),
            )
            set({ todos: fetched, isLoading: false })
          } catch (err: unknown) {
            let errorMessage = 'Failed to fetch todos.';
            if (err instanceof Error) {
              errorMessage = err.message;
            }
            set({ error: errorMessage, isLoading: false })
          }
        },

        addTodo: (text: string) => {
          const currentState = get();
          const hasDuplicate = currentState.todos.some(
            (todo) => todo.text.toLowerCase() === text.toLowerCase()
          );

          if (hasDuplicate) {
            console.warn(`Todo with text "${text}" already exists.`);
            return;
          }
          
          set((state) => ({
            todos: [
              ...state.todos,
              { id: Date.now(), text, completed: false },
            ],
          }));
        },

        removeTodo: (id: number) =>
          set((state) => ({
            todos: state.todos.filter((t) => t.id !== id),
          })),

        toggleTodo: (id: number) =>
          set((state) => ({
            todos: state.todos.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t,
            ),
          })),

        setFilter: (filter: Filter) => set({ filter }),

        clearCompleted: () =>
          set((state) => ({
            todos: state.todos.filter((t) => !t.completed),
          })),
      }),
      {
        name: 'todo-storage',
        partialize: (state) => ({ todos: state.todos, filter: state.filter }),
      },
    ),
    { name: 'TodoAppStore' },
  ),
)