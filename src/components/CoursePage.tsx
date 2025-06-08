import React, { useRef, useEffect } from 'react'
import { marked } from 'marked'
import courseMd from '../../ZUSTAND_COURSE.md?raw'

const CoursePage: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const html = marked(courseMd)
  const srcDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Zustand Course</title>
  <link rel="stylesheet" href="https://unpkg.com/mvp.css">
  <style>
    body { 
    padding: 1rem;
    background-color: #f0f0f0;
    }
    pre, code {
      max-width: unset !important;
    }
    pre { overflow-x: auto; }
  </style>
</head>
<body>${html}</body>
</html>`
  const onIframeLoad = () => {
    const iframe = iframeRef.current
    if (iframe?.contentDocument) {
      iframe.style.height = iframe.contentDocument.body.scrollHeight + 'px'
    }
  }
  useEffect(() => {
    window.addEventListener('resize', onIframeLoad)
    return () => window.removeEventListener('resize', onIframeLoad)
  }, [])
  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDoc}
      title="Zustand Course"
      onLoad={onIframeLoad}
      style={{ width: '100%', border: 'none' }}
    />
  )
}

export default CoursePage 