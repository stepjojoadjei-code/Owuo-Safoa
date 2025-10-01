import React, { useState } from 'react';
import { characters } from '../data/gameData';
import { useGameState } from '../hooks/useGameState';
import { useAudio } from '../hooks/useAudio';
import { Character } from '../types';

const CharacterSelectScreen: React.FC = () => {
  const { dispatch } = useGameState();
  const { playSound } = useAudio();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(characters[0]);

  const handleSelect = (character: Character) => {
    setSelectedCharacter(character);
    playSound('click');
  };

  const handleConfirm = () => {
    if (selectedCharacter) {
      dispatch({ type: 'SELECT_CHARACTER', payload: selectedCharacter.id });
      playSound('confirm');
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background-dark text-white">
      <header className="flex items-center justify-center p-4">
        <h1 className="text-xl font-bold">Select Your Hero</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {characters.map((char) => (
            <div
              key={char.id}
              onClick={() => handleSelect(char)}
              className={`group flex cursor-pointer flex-col items-center space-y-3 rounded-lg bg-background-light/5 dark:bg-background-dark/20 p-2 text-center transition-all duration-300 ${
                selectedCharacter?.id === char.id
                  ? 'ring-2 ring-primary'
                  : 'hover:bg-primary/10 dark:hover:bg-primary/20'
              }`}
            >
              <div className="relative w-full aspect-square">
                <div
                  className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${
                    selectedCharacter?.id === char.id
                      ? 'border-primary shadow-lg shadow-primary/30'
                      : 'border-transparent group-hover:border-primary/50'
                  }`}
                ></div>
                <div
                  className="h-full w-full rounded-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url("${char.imageUrl}")`, transform: selectedCharacter?.id === char.id ? 'scale(1.05)' : 'scale(1)' }}
                ></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{char.name}</h3>
                <p className="text-sm text-gray-400">{char.title}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-4 bg-background-dark/80 backdrop-blur-sm">
        <div className="mb-4 text-center min-h-[72px]">
            <h2 className="text-2xl font-bold">{selectedCharacter?.name}</h2>
            <p className="text-gray-400">{selectedCharacter?.description}</p>
        </div>
        <button
          onClick={handleConfirm}
          disabled={!selectedCharacter}
          className="w-full rounded-lg bg-primary py-4 px-5 text-lg font-bold text-white transition-colors duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          Begin Your Journey
        </button>
      </footer>
    </div>
  );
};

export default CharacterSelectScreen;