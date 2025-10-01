import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { Character, Ability } from '../types';
import { useGameState } from '../hooks/useGameState';
import { useAudio } from '../hooks/useAudio';

interface CharacterModalProps {
  character: Character;
  onClose: () => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ character, onClose }) => {
  const { state, dispatch } = useGameState();
  const { playSound } = useAudio();
  const [shakeError, setShakeError] = useState<string | null>(null);
  
  const nodeRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const svgRef = useRef<SVGSVGElement | null>(null);
  // FIX: Use React.ReactElement to avoid JSX namespace errors.
  const [lines, setLines] = useState<React.ReactElement[]>([]);

  const unlockedSkills = state.unlockedSkills[character.id] || [];
  const skillPoints = state.skillPoints[character.id] || 0;

  const handleUnlockSkill = (skill: Ability) => {
    if (skillPoints < 1) {
      setShakeError('points');
      setTimeout(() => setShakeError(null), 500);
      playSound('error');
      return;
    }
    if (skill.requires && !unlockedSkills.includes(skill.requires)) {
      setShakeError(skill.id);
      setTimeout(() => setShakeError(null), 500);
      playSound('error');
      return;
    }
    dispatch({ type: 'UNLOCK_SKILL', payload: { characterId: character.id, skill } });
    playSound('upgrade');
  };
  
  const handleResetSkills = () => {
    dispatch({ type: 'RESET_SKILLS', payload: character.id });
    playSound('click');
  }

  useLayoutEffect(() => {
    // FIX: Use React.ReactElement to avoid JSX namespace errors.
    const newLines: React.ReactElement[] = [];
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();

    character.skillTree.forEach(skill => {
        if (skill.requires) {
            const startNode = nodeRefs.current.get(skill.requires);
            const endNode = nodeRefs.current.get(skill.id);

            if (startNode && endNode) {
                const startRect = startNode.getBoundingClientRect();
                const endRect = endNode.getBoundingClientRect();

                const x1 = startRect.left + startRect.width / 2 - svgRect.left;
                const y1 = startRect.top + startRect.height / 2 - svgRect.top;
                const x2 = endRect.left + endRect.width / 2 - svgRect.left;
                const y2 = endRect.top + endRect.height / 2 - svgRect.top;
                
                const isUnlocked = unlockedSkills.includes(skill.id);

                newLines.push(
                    <line key={`${skill.requires}-${skill.id}`} x1={x1} y1={y1} x2={x2} y2={y2} 
                    className={`skill-tree-line ${isUnlocked ? 'stroke-primary' : 'stroke-gray-600'}`} />
                );
            }
        }
    });
    setLines(newLines);
  }, [character.skillTree, unlockedSkills]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-background-dark border-2 border-primary/50 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 flex justify-between items-center border-b border-primary/20">
          <h2 className="text-2xl font-bold text-white">{character.name}'s Dossier</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
             <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center text-center">
            <img src={character.imageUrl} alt={character.name} className="w-48 h-48 rounded-full border-4 border-primary object-cover mb-4" />
            <h3 className="text-xl font-bold text-primary">{character.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{character.title}</p>
            <p className="text-base text-gray-300">{character.description}</p>
          </div>
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold text-white">Skill Tree</h4>
              <div className={`p-2 rounded-lg bg-primary/20 text-center ${shakeError === 'points' ? 'animate-shake' : ''}`}>
                <p className="font-bold text-primary text-lg">{skillPoints}</p>
                <p className="text-xs text-white/80">Skill Points</p>
              </div>
            </div>
            <div className="relative">
                 <svg ref={svgRef} className="absolute inset-0 w-full h-full">
                    {lines}
                </svg>
                <div className="grid grid-cols-2 gap-4">
              {character.skillTree.map(skill => {
                const isUnlocked = unlockedSkills.includes(skill.id);
                const canUnlock = skill.requires ? unlockedSkills.includes(skill.requires) : true;
                return (
                  <button
                    key={skill.id}
                    // FIX: ref callback must not return a value. Wrapped in a block to ensure void return.
                    // Also handled null case for when component unmounts.
                    ref={el => {
                        if (el) {
                            nodeRefs.current.set(skill.id, el);
                        } else {
                            nodeRefs.current.delete(skill.id);
                        }
                    }}
                    onClick={() => !isUnlocked && handleUnlockSkill(skill)}
                    disabled={isUnlocked}
                    className={`p-4 border-2 rounded-lg text-left transition-all duration-300 relative ${
                      isUnlocked
                        ? 'bg-primary/30 border-primary cursor-default'
                        : canUnlock
                        ? 'bg-gray-700/50 border-gray-600 hover:bg-primary/20 hover:border-primary'
                        : 'bg-gray-800/50 border-gray-700 opacity-60 cursor-not-allowed'
                    } ${shakeError === skill.id ? 'animate-shake' : ''}`}
                  >
                    <h5 className="font-bold text-white">{skill.name}</h5>
                    <p className="text-sm text-gray-400">{skill.description}</p>
                    {isUnlocked && <span className="material-symbols-outlined absolute top-2 right-2 text-primary">lock_open</span>}
                  </button>
                );
              })}
            </div>
            </div>
             <div className="mt-6 text-center">
                <button onClick={handleResetSkills} className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors">
                    Reset Skills
                </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CharacterModal;