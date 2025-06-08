import React from 'react'
import ReactMarkdown from 'react-markdown'
import courseMd from '../../ZUSTAND_COURSE.md?raw'

const CoursePage: React.FC = () => (
  <div style={{ padding: '1rem' }}>
    <h1>Zustand Course</h1>
    <ReactMarkdown>{courseMd}</ReactMarkdown>
  </div>
)

export default CoursePage 