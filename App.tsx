import React from 'react';
import { useGameState } from './hooks/useGameState';
import CharacterSelectScreen from './components/CharacterSelectScreen';
import MainGameUI from './components/MainGameUI';
import CombatScreen from './components/CombatScreen';

const App: React.FC = () => {
  const { state } = useGameState();

  return (
    <div className="h-screen w-screen bg-background-light dark:bg-background-dark font-display">
      {state.screen === 'character-select' && <CharacterSelectScreen />}
      {state.screen === 'main-hub' && <MainGameUI />}
      {state.screen === 'combat' && <CombatScreen />}
    </div>
  );
};

export default App;
