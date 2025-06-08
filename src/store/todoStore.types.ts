export interface Todo {
    id: number
    text: string
    completed: boolean
  }
  
  export type Filter = 'all' | 'active' | 'completed'
  
   export interface TodoState {
    todos: Todo[]
    filter: Filter
    isLoading: boolean
    error: string | null
  
    // --- ACTIONS ---
    fetchTodos: () => Promise<void>
    addTodo: (text: string) => void
    removeTodo: (id: number) => void
    toggleTodo: (id: number) => void
    setFilter: (filter: Filter) => void
    clearCompleted: () => void
  }