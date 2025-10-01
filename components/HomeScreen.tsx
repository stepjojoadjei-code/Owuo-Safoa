import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { characters } from '../data/gameData';
import CharacterModal from './CharacterModal';

const HomeScreen: React.FC = () => {
  const { state } = useGameState();
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const character = characters.find(c => c.id === state.selectedCharacterId);

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full p-4 flex flex-col items-center justify-center text-center bg-background-dark text-white">
       <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: `url('${character.imageUrl}')`}}></div>
       <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>

      <div className="relative z-10">
        <img src={character.imageUrl} alt={character.name} className="w-40 h-40 rounded-full border-4 border-primary object-cover mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Welcome, {character.name}</h1>
        <p className="text-lg text-gray-400 mb-6">{character.title}</p>
        <button 
            onClick={() => setIsDossierOpen(true)}
            className="w-full max-w-xs bg-primary text-white font-bold py-3 px-5 rounded-lg text-lg hover:bg-primary/90 transition-colors">
          View Dossier
        </button>
      </div>
      {isDossierOpen && <CharacterModal character={character} onClose={() => setIsDossierOpen(false)} />}
    </div>
  );
};

export default HomeScreen;
