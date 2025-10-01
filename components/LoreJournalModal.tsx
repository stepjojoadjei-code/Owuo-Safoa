import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { loreEntries } from '../data/gameData';
import { LoreEntry } from '../types';
import LoreOracle from './LoreOracle';

interface LoreJournalModalProps {
  onClose: () => void;
}

const LoreJournalModal: React.FC<LoreJournalModalProps> = ({ onClose }) => {
  const { state } = useGameState();
  const [selectedEntry, setSelectedEntry] = useState<LoreEntry | null>(null);

  const categories = [...new Set(loreEntries.map(e => e.category))];
  
  const unlockedEntries = loreEntries.filter(e => state.unlockedLore.includes(e.id));
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-background-dark border-2 border-primary/50 rounded-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 flex justify-between items-center border-b border-primary/20">
          <h2 className="text-2xl font-bold text-white">Lore & Oracle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        <main className="flex-1 flex overflow-hidden">
          <aside className="w-1/3 border-r border-primary/20 overflow-y-auto p-4">
            <h3 className="text-lg font-bold text-primary mb-4">Journal Entries</h3>
            {categories.map(category => (
              <div key={category} className="mb-4">
                <h4 className="font-bold text-white">{category}</h4>
                <ul>
                  {loreEntries
                    .filter(e => e.category === category)
                    .map(entry => {
                      const isUnlocked = unlockedEntries.some(ue => ue.id === entry.id);
                      return (
                        <li key={entry.id}>
                          <button
                            onClick={() => isUnlocked && setSelectedEntry(entry)}
                            disabled={!isUnlocked}
                            className={`w-full text-left p-1 rounded ${
                              isUnlocked
                                ? 'text-gray-300 hover:bg-primary/20'
                                : 'text-gray-600 cursor-not-allowed'
                            } ${selectedEntry?.id === entry.id ? 'text-primary' : ''}`}
                          >
                            {isUnlocked ? entry.title : '??????????'}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </aside>
          <section className="w-2/3 flex flex-col">
            {selectedEntry ? (
              <div className="p-6 overflow-y-auto flex-1">
                <h3 className="text-2xl font-bold text-primary mb-4">{selectedEntry.title}</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedEntry.content}</p>
              </div>
            ) : (
               <div className="p-6 flex-1 flex flex-col">
                 <LoreOracle />
               </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default LoreJournalModal;
