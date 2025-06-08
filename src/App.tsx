// src/App.tsx
import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import TodoApp from './components/TodoApp'
import './App.css'
import CoursePage from './components/CoursePage'

const App: React.FC = () => (
  <BrowserRouter>
    <nav style={{ margin: '1rem' }}>
      <Link to="/">Todos</Link>
      {' | '}
      <Link to="/course">Course</Link>
    </nav>
    <Routes>
      <Route path="/" element={<TodoApp />} />
      <Route path="/course" element={<CoursePage />} />
    </Routes>
  </BrowserRouter>
)

export default App
