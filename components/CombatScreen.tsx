import React, { useState, useEffect, useMemo } from 'react';
import { useGameState } from '../hooks/useGameState';
import { characters } from '../data/gameData';
import { generateCombatTurn } from '../services/geminiService';
import { Ability } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useAudio } from '../hooks/useAudio';
import { useTypewriter } from '../hooks/useTypewriter';

const CombatScreen: React.FC = () => {
  const { state, dispatch } = useGameState();
  const { playSound } = useAudio();
  const [isResolving, setIsResolving] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [enemyHit, setEnemyHit] = useState(false);
  
  const { combatState, selectedCharacterId } = state;
  const character = useMemo(() => characters.find(c => c.id === selectedCharacterId), [selectedCharacterId]);
  
  const currentLog = combatState.turnLog.slice(-2).join('\n');
  const displayedLog = useTypewriter(currentLog, 30);


  useEffect(() => {
    if (!isResolving && (combatState.playerHealth <= 0 || combatState.enemyHealth <= 0)) {
      setTimeout(() => setShowEndScreen(true), 1500);
    }
  }, [combatState.playerHealth, combatState.enemyHealth, isResolving]);

  const handleAbilityClick = async (ability: Ability) => {
    if (isResolving || !character || !combatState.enemy) return;

    setIsResolving(true);
    playSound('attack');

    const narrative = await generateCombatTurn(character, ability, combatState.enemy);
    
    setEnemyHit(true);
    setTimeout(() => setEnemyHit(false), 400);

    const playerDamage = ability.damage || 5;
    const enemyDamage = combatState.enemy.attackDamage || 5;

    // Dispatch player action
    dispatch({
      type: 'PROCESS_COMBAT_TURN',
      payload: { playerDamage, enemyDamage: 0, log: narrative },
    });

    // Enemy action after a delay
    setTimeout(() => {
        if(state.combatState.enemyHealth - playerDamage > 0) {
            setPlayerHit(true);
            setTimeout(() => setPlayerHit(false), 400);
            dispatch({
                type: 'PROCESS_COMBAT_TURN',
                payload: { playerDamage: 0, enemyDamage, log: `${combatState.enemy?.name} retaliates with ${combatState.enemy?.attackName}!` },
            });
        }
        setIsResolving(false);
    }, 1200);
  };

  const handleEndCombat = () => {
    dispatch({ type: 'END_COMBAT', payload: { victory: combatState.playerHealth > 0 } });
  };
  
  if (!character || !combatState.enemy) {
    return (
        <div className="flex h-screen items-center justify-center bg-background-dark">
            <LoadingSpinner />
        </div>
    );
  }
  
  const playerHealthPercent = (combatState.playerHealth / character.baseHealth) * 100;
  const enemyHealthPercent = (combatState.enemyHealth / combatState.enemy.health) * 100;
  const unlockedAbilities = character.skillTree.filter(skill => state.unlockedSkills[character.id]?.includes(skill.id));


  if(showEndScreen) {
    const victory = combatState.playerHealth > 0;
    return (
        <div className="flex h-screen flex-col items-center justify-center text-center bg-background-dark p-4 animate-fadeIn">
            <img src={victory ? character.imageUrl : combatState.enemy.imageUrl} alt={victory ? character.name : combatState.enemy.name} className={`w-48 h-48 rounded-full border-4 object-cover mb-4 ${victory ? 'border-primary' : 'border-red-500'}`} />
            <h1 className={`text-5xl font-bold mb-4 ${victory ? 'text-primary' : 'text-red-500'}`}>{victory ? "Victory!" : "Defeated"}</h1>
            <p className="text-lg mb-2 text-gray-300">{victory ? "You have overcome your foe." : "You have been overcome."}</p>
            {victory && <p className="text-green-400 font-bold mb-8">+1 Skill Point</p>}
            <button onClick={handleEndCombat} className="w-full max-w-xs bg-primary text-white font-bold py-3 px-5 rounded-lg text-lg hover:bg-primary/90 transition-colors">
                Continue
            </button>
        </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-background-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm" style={{backgroundImage: `url('${combatState.enemy.imageUrl}')`}}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 via-background-dark/80 to-background-dark"></div>
      
        <div className="relative z-10 flex flex-1 flex-col p-4 justify-between">
            {/* Enemy Area */}
            <div className="flex flex-col items-center">
                <div className={`relative transition-transform duration-300 ${enemyHit ? 'animate-shake' : ''}`}>
                    <div className={`absolute inset-0 transition-colors duration-100 rounded-lg ${enemyHit ? 'bg-red-500/50' : 'bg-transparent'}`}></div>
                    <img src={combatState.enemy.imageUrl} alt={combatState.enemy.name} className="h-40 object-contain drop-shadow-lg" />
                </div>
                <p className="font-bold text-lg mt-2">{combatState.enemy.name}</p>
                <div className="w-full max-w-xs rounded-full bg-red-500/20 h-2.5 mt-2 border border-black/20">
                    <div className="h-full rounded-full bg-red-500 transition-all duration-500" style={{ width: `${enemyHealthPercent}%` }}></div>
                </div>
            </div>
            
            {/* Log Area */}
            <div className="w-full bg-black/50 p-4 my-4 rounded-lg min-h-[100px] text-center backdrop-blur-sm whitespace-pre-wrap flex items-center justify-center">
                {isResolving && !displayedLog ? <LoadingSpinner /> : <p>{displayedLog}</p>}
            </div>

            {/* Player Area */}
            <div className="flex flex-col items-center">
                <div className="w-full max-w-xs rounded-full bg-primary/20 h-2.5 mb-2 border border-black/20">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${playerHealthPercent}%` }}></div>
                </div>
                <p className="font-bold text-lg mb-2">{character.name}</p>
                 <div className={`relative transition-transform duration-300 ${playerHit ? 'animate-shake' : ''}`}>
                    <div className={`absolute inset-0 transition-colors duration-100 rounded-full ${playerHit ? 'bg-red-500/50' : 'bg-transparent'}`}></div>
                    <img src={character.imageUrl} alt={character.name} className="h-28 w-28 rounded-full border-4 border-primary object-cover" />
                </div>
            </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-2 p-2 bg-background-dark/50 border-t border-primary/20">
            {unlockedAbilities.map(ability => (
                 <button 
                    key={ability.id}
                    onClick={() => handleAbilityClick(ability)}
                    disabled={isResolving}
                    className="p-4 text-sm font-bold text-center rounded-lg bg-primary/80 disabled:bg-gray-600/50 disabled:text-gray-400 hover:bg-primary transition-colors">
                     {ability.name}
                </button>
            ))}
        </div>
    </div>
  );
};

export default CombatScreen;