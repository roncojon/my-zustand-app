import React from 'react'
import { marked } from 'marked'
import courseMd from '../../ZUSTAND_COURSE.md?raw'
// CoursePage is rendered inside an isolated iframe with its own styles

const CoursePage: React.FC = () => {
  const html = marked(courseMd)
  const srcDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Zustand Course</title>
  <link rel="stylesheet" href="https://unpkg.com/mvp.css">
  <style>
    body { padding: 1rem; }
    pre, code {
      max-width: unset !important;
    }
    pre { overflow-x: auto; }
  </style>
</head>
<body>${html}</body>
</html>`
  return (
    <iframe
      srcDoc={srcDoc}
      title="Zustand Course"
      style={{ width: '100%', height: '100vh', border: 'none' }}
    />
  )
}

export default CoursePage 