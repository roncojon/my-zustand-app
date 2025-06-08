// src/components/TodoApp.tsx
import React, { useEffect, useState, useMemo } from 'react'
import { useTodoStore } from '../store/todoStore'
import type { Todo } from '../store/todoStore'
import './TodoApp.css'

const TodoApp: React.FC = () => {
  const todosRaw = useTodoStore((state) => state.todos)
  const filter = useTodoStore((state) => state.filter)
  const isLoading = useTodoStore((state) => state.isLoading)
  const error = useTodoStore((state) => state.error)

  const {
    fetchTodos,
    addTodo,
    removeTodo,
    toggleTodo,
    setFilter,
    clearCompleted,
  } = useTodoStore((state) => state)

  const [newTodo, setNewTodo] = useState('')

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

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const handleAdd = () => {
    if (newTodo.trim() !== '') {
      addTodo(newTodo.trim())
      setNewTodo('')
    }
  }

  return (
    <div className="todo-app">
      <h1>Zustand Todo App</h1>

      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="What needs to be done?"
        />
        <button onClick={handleAdd}>Add Todo</button>
      </div>

      <div className="filters">
        {(['all', 'active', 'completed'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            disabled={filter === type}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="todo-list-container">
        {isLoading && <p>Loading todos...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && (
          <ul className="todo-list">
            {filteredTodos.map((todo: Todo) => (
              <li key={todo.id}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span
                  style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                >
                  {todo.text}
                </span>
                <button onClick={() => removeTodo(todo.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {todosRaw.some(t => t.completed) && (
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
      )}
    </div>
  )
}

export default TodoApp