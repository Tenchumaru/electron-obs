import { useState } from 'react';
import './App.css';

export function App() {
  const [streaming, setStreaming] = useState(false);
  const [streamKey, setStreamKey] = useState('');

  return (
    <>
      {streaming ? (
        <button onClick={stopStreaming}>Stop</button>
      ) : (
        <>
          <label>
            <span>Twitch Stream Key:</span>
            <input value={streamKey} onInput={handleInput} />
          </label>
          <button onClick={startStreaming}>Start</button>
        </>
      )}
    </>
  );

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const result = event.currentTarget.value;
    setStreamKey(result);
  }

  async function startStreaming() {
    const result = await window.main.startStreaming(streamKey);
    setStreaming(result);
  }

  function stopStreaming() {
    window.main.stopStreaming();
    setStreaming(false);
  }
}
