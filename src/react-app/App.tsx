import React, { useEffect, useState } from 'react';

const WORKER_URL = 'https://creao-worker.dmco.workers.dev';

interface StreamItem {
  id: string;
  message: string;
}

function App() {
  const [streamData, setStreamData] = useState<StreamItem[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(WORKER_URL);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (isStreamItem(data)) {
          setStreamData(prev => [...prev, data]);
        } else {
          console.warn('Received data does not match expected structure:', data);
        }
      } catch (e) {
        console.error('Error parsing SSE:', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return (
    <div>
      <h1>Creao API Stream</h1>
      <ul>
        {streamData.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}

function isStreamItem(obj: any): obj is StreamItem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.message === 'string'
  );
}

export default App;
