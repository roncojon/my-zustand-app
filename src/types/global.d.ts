declare global {
  type Todo = {
    id: number
    text: string
    completed: boolean
  }

  type Filter = 'all' | 'active' | 'completed'

  interface TodoState {
    todos: Todo[]
    filter: Filter
    isLoading: boolean
    error: string | null
    fetchTodos: () => Promise<void>
    addTodo: (text: string) => void
    removeTodo: (id: number) => void
    toggleTodo: (id: number) => void
    setFilter: (filter: Filter) => void
    clearCompleted: () => void
  }
}

// Required for global declarations in modules
export {} 