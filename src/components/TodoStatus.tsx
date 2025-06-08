// src/components/TodoStatus.tsx
import React from 'react'
import { useTodoStore } from '../store/todoStore'
import './TodoStatus.css'

/**
 * This component demonstrates a key benefit of a global state manager:
 * - It can subscribe to the same store as TodoApp.
 * - It selects only the data it needs (`todos`).
 * - It re-renders only when `todos` change, independent of other components.
 * - This is achieved without any "prop drilling".
 */
const TodoStatus: React.FC = () => {
  // Select only the `todos` array. This component will only re-render
  // when the `todos` array itself changes.
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

export default TodoStatus