import React, { useEffect, useState } from 'react'

const WORKER_URL = 'https://creao-worker.dmco.workers.dev'

function App() {
  const [streamData, setStreamData] = useState([])

  useEffect(() => {
    const eventSource = new EventSource(WORKER_URL)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setStreamData(prev => [...prev, data])
      } catch (e) {
        console.error('Error parsing SSE:', e)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
    }

    return () => eventSource.close()
  }, [])

  return (
    <div>
      <h1>Creao API Stream</h1>
      <ul>
        {streamData.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
