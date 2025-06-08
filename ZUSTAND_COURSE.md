# Learning Zustand: A Practical Guide with a Todo App

Welcome to this hands-on guide to learning Zustand! Zustand is a small, fast, and scalable state-management solution for React. Its philosophy is to be simple, unopinionated, and to leverage hooks in a way that feels intuitive and modern.

This guide will walk you through a fully functional Todo application, explaining how Zustand is used to manage its state, and highlighting the best practices demonstrated in the code.

## Prerequisites

- Basic understanding of React and React Hooks (useState, useEffect)
- Familiarity with TypeScript
- Node.js and npm/yarn installed

## Project Structure Overview

Our application is structured as follows:

```
src
├── App.tsx             # Main application component, renders the app layout
├── App.css             # Global styles
├── components
│   ├── TodoApp.tsx     # The main UI for the todo list
│   ├── TodoApp.css     # Styles for TodoApp
│   ├── TodoStatus.tsx  # A separate component showing todo stats
│   └── TodoStatus.css  # Styles for TodoStatus
└── store
    └── todoStore.ts    # The heart of our app: the Zustand store
```

## 1. The Core: Creating a Zustand Store (todoStore.ts)

The single most important file for our state management is `src/store/todoStore.ts`. This is where we define our state's "shape," its initial values, and the actions that can modify it.

Let's break it down.

### Defining the State and Actions

First, we define our data structures with TypeScript. This gives us excellent type safety and autocompletion throughout our app.

```typescript
// src/store/todoStore.ts

export interface Todo {
  id: number
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

export interface TodoState {
  // State Data
  todos: Todo[]
  filter: Filter
  isLoading: boolean
  error: string | null

  // Actions (functions that modify state)
  fetchTodos: () => Promise<void>
  addTodo: (text: string) => void
  // ... other actions
}
```

**Best Practice:** Defining your state and actions with a TypeScript interface (`TodoState`) is a fantastic pattern. It creates a single source of truth for the store's "contract," making it easy to understand what data is available and how it can be manipulated.

### The create Function

The `create` function is the foundation of Zustand. It takes a function that receives `set` and `get` as arguments and returns the store's state and actions.

```typescript
import { create } from 'zustand'

export const useTodoStore = create<TodoState>()(...)
```

The hook we'll use in our components, `useTodoStore`, is the direct result of this `create` call.

### Implementing Actions

Inside `create`, we define the implementation for each action.

```typescript
// src/store/todoStore.ts

(set, get) => ({
  // --- INITIAL STATE ---
  todos: [],
  filter: 'all',
  isLoading: false,
  error: null,

  // --- ACTIONS IMPLEMENTATION ---

  // Async Action
  fetchTodos: async () => {
    set({ isLoading: true, error: null }) // Update state immediately
    try {
      const fetched: Todo[] = await new Promise(...)
      set({ todos: fetched, isLoading: false }) // Update on success
    } catch (err: unknown) {
      set({ error: 'Failed to fetch', isLoading: false }) // Update on error
    }
  },

  // Sync Action
  addTodo: (text: string) => {
    // Reading current state with get()
    const hasDuplicate = get().todos.some(
      (todo) => todo.text.toLowerCase() === text.toLowerCase()
    );

    if (hasDuplicate) return;

    // Updating state with set()
    set((state) => ({
      todos: [
        ...state.todos,
        { id: Date.now(), text, completed: false },
      ],
    }));
  },

  // Other sync actions...
  removeTodo: (id: number) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
})
```

**Key Concepts to Note:**

- **Immutability:** Actions update state by creating new objects or arrays (`...state.todos`, `.filter`, `.map`). This is crucial for React's rendering mechanism and prevents bugs.
- **set Function:** This is how you update state. You can pass it an object to merge (`set({ isLoading: true })`) or a function that receives the current state (`set(state => ({ ... }))`) for more complex updates.
- **get Function:** This allows you to access the current state from inside an action. Our `addTodo` action uses it to check for duplicates before calling `set`. This is a powerful feature for implementing complex logic.
- **Async Actions:** Handling async operations is trivial. You can await promises and call `set` multiple times to reflect loading and error states, just as you would in a regular async function.

### Supercharging with Middleware

Zustand's middleware adds powerful capabilities with minimal effort. Our store uses two essential ones: `devtools` and `persist`.

```typescript
// src/store/todoStore.ts
import { devtools, persist } from 'zustand/middleware'

export const useTodoStore = create<TodoState>()(
  devtools( // 1. devtools middleware
    persist( // 2. persist middleware
      (set, get) => ({
        // ... our store implementation
      }),
      { // Configuration for `persist`
        name: 'todo-storage',
        // Only persist a subset of the state
        partialize: (state) => ({ todos: state.todos, filter: state.filter }),
      },
    ),
    { name: 'TodoAppStore' }, // Configuration for `devtools`
  ),
)
```

- **devtools:** This connects your store to the Redux DevTools extension in your browser. It's an indispensable tool for debugging, allowing you to see every action, inspect state changes over time, and even "time travel" to previous states.
- **persist:** This middleware automatically saves parts of your store's state to a storage medium (like localStorage by default) and rehydrates it when the app loads.

**Best Practice (partialize):** The persist middleware is configured with `partialize`. This is a critical optimization. We are telling Zustand to only save the `todos` and `filter` state. We explicitly exclude transient state like `isLoading` and `error`, which should be reset on every app load.

## 2. Using the Store in Components (TodoApp.tsx)

Now that we have a store, let's see how our components use it.

### Selecting State with the Hook

To get data from the store, you call the `useTodoStore` hook with a selector function. This function tells Zustand exactly which piece of state your component needs.

```typescript
// src/components/TodoApp.tsx

const todosRaw = useTodoStore((state) => state.todos)
const filter = useTodoStore((state) => state.filter)
const isLoading = useTodoStore((state) => state.isLoading)
```

**Performance Best Practice (Selectors):** This is the most important concept for performance in Zustand. A component re-renders only if the value returned by its selector function changes.

- If you select `state.todos`, the component re-renders only when the todos array is updated.
- It will not re-render if `filter` or `isLoading` changes.
- This "atomic" selection prevents unnecessary re-renders automatically.

### Selecting Actions

To get actions, you can select them just like state. A common pattern is to grab all the actions at once if a component uses several of them.

```typescript
// src/components/TodoApp.tsx

const {
  fetchTodos,
  addTodo,
  removeTodo,
  // ...
} = useTodoStore((state) => state) // Select the whole state
```

**Wait, doesn't selecting the whole state cause re-renders on every change?** No! Zustand is smart about this. Actions are static functions, so `useTodoStore` sees that the action part of the state object never changes, and it doesn't trigger a re-render. This is a clean and efficient way to grab all the actions you need.

### Derived State with useMemo

Sometimes, you need to compute data based on the state from the store. In our app, we need to filter the todos based on the current filter.

```typescript
// src/components/TodoApp.tsx

const filteredTodos = useMemo(() => {
  switch (filter) {
    case 'active':
      return todosRaw.filter((t) => !t.completed)
    case 'completed':
      return todosRaw.filter((t) => t.completed)
    default: // 'all'
      return todosRaw
  }
}, [todosRaw, filter])
```

**Best Practice:** Using `useMemo` for derived data is a standard React pattern that works perfectly with Zustand. It ensures that the `filteredTodos` list is only recalculated when `todosRaw` or `filter` actually changes, not on every single render.

## 3. The Power of Decoupling (TodoStatus.tsx)

The `TodoStatus` component beautifully illustrates a key benefit of a global state manager like Zustand.

```typescript
// src/components/TodoStatus.tsx
import React from 'react'
import { useTodoStore } from '../store/todoStore'

const TodoStatus: React.FC = () => {
  // Select ONLY the `todos` array.
  const todos = useTodoStore((state) => state.todos)

  const completedCount = todos.filter((t) => t.completed).length
  const totalCount = todos.length

  return (
    <div className="todo-status">
      <span>
        {completedCount} / {totalCount} Completed
      </span>
    </div>
  )
}
```

**Notice:**

- **No Prop Drilling:** `TodoStatus` doesn't receive any props from `TodoApp`. It connects directly to the `useTodoStore` and gets the data it needs.
- **Performance:** Because its selector is `(state) => state.todos`, this component will only re-render when the todos list changes. If the user clicks a filter button (which only changes the filter state), this component does not re-render, because the data it cares about (todos) hasn't changed. This is a huge advantage over simpler Context-based solutions.

## Conclusion & Key Takeaways

This project is an excellent example of a well-structured React application using Zustand. Let's summarize the key patterns and best practices we've learned:

- **Single Source of Truth:** All application state logic is centralized in `todoStore.ts`.
- **TypeScript for Safety:** An interface for the state shape (`TodoState`) provides a clear and safe contract for your store.
- **Atomic Selectors for Performance:** Components select the smallest slice of state they need, preventing unnecessary re-renders.
- **Separation of Concerns:** State logic (checking for duplicates, fetching data) lives in the store, not in the components. Components are responsible for dispatching actions and rendering the UI.
- **Powerful Middleware:** `devtools` for debugging and `persist` (with `partialize`) for smart local storage are easy to add and provide immense value.
- **Decoupled Components:** Components anywhere in the tree can access global state without prop drilling, and they remain performant by only subscribing to the data they need.

Zustand empowers you to write clean, maintainable, and performant state management code without the boilerplate often associated with other libraries. Happy coding!