import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GameStateProvider } from './contexts/GameStateContext';
import { AudioProvider } from './contexts/AudioContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <GameStateProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </GameStateProvider>
  </React.StrictMode>
);
