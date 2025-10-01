import React, { createContext, useReducer, ReactNode, Dispatch, useEffect } from 'react';
import { GameState, Ability, ToastData, Enemy } from '../types';
import { characters } from '../data/gameData';

type Action =
  | { type: 'SELECT_CHARACTER'; payload: string }
  | { type: 'UNLOCK_SKILL'; payload: { characterId: string; skill: Ability } }
  | { type: 'RESET_SKILLS'; payload: string }
  | { type: 'START_COMBAT'; payload: Enemy }
  | { type: 'PROCESS_COMBAT_TURN'; payload: { playerDamage: number; enemyDamage: number; log: string } }
  | { type: 'END_COMBAT'; payload: { victory: boolean } }
  | { type: 'RESET_PROGRESS' };

const initialState: GameState = {
  screen: 'character-select',
  selectedCharacterId: null,
  unlockedSkills: {},
  skillPoints: {},
  unlockedLore: [],
  readLore: [],
  activeQuests: ['reaver_hunt', 'citadel_secrets'],
  completedQuests: [],
  toastMessage: null,
  combatState: {
    isActive: false,
    enemy: null,
    playerHealth: 0,
    enemyHealth: 0,
    turnLog: [],
  },
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'SELECT_CHARACTER':
        const character = characters.find(c => c.id === action.payload);
        if (!character) return state;
        const baseSkills = character.skillTree.filter(s => !s.requires).map(s => s.id);
        return {
            ...initialState,
            screen: 'main-hub',
            selectedCharacterId: action.payload,
            skillPoints: { [action.payload]: 0 },
            unlockedSkills: { [action.payload]: baseSkills },
            activeQuests: ['reaver_hunt', 'citadel_secrets'],
        };
    case 'UNLOCK_SKILL':
        const { characterId, skill } = action.payload;
        if ((state.skillPoints[characterId] || 0) < 1) return state; // Not enough points
        return {
            ...state,
            skillPoints: {
                ...state.skillPoints,
                [characterId]: (state.skillPoints[characterId] || 0) - 1,
            },
            unlockedSkills: {
                ...state.unlockedSkills,
                [characterId]: [...(state.unlockedSkills[characterId] || []), skill.id],
            },
        };
    case 'RESET_SKILLS':
        const charToReset = characters.find(c => c.id === action.payload);
        if(!charToReset) return state;
        const unlockedCount = state.unlockedSkills[action.payload]?.length || 0;
        const baseSkillCount = charToReset.skillTree.filter(s => !s.requires).length;
        const newSkillPoints = (state.skillPoints[action.payload] || 0) + (unlockedCount - baseSkillCount);
        const newBaseSkills = charToReset.skillTree.filter(s => !s.requires).map(s => s.id);

        return {
            ...state,
            skillPoints: { ...state.skillPoints, [action.payload]: newSkillPoints },
            unlockedSkills: { ...state.unlockedSkills, [action.payload]: newBaseSkills },
        }
    case 'START_COMBAT':
        const player = characters.find(c => c.id === state.selectedCharacterId);
        if (!player) return state;
        return {
            ...state,
            screen: 'combat',
            combatState: {
                isActive: true,
                enemy: action.payload,
                playerHealth: player.baseHealth,
                enemyHealth: action.payload.health,
                turnLog: [`Combat begins! You face a ferocious ${action.payload.name}!`],
            }
        };
    case 'PROCESS_COMBAT_TURN':
        const newPlayerHealth = state.combatState.playerHealth - action.payload.enemyDamage;
        const newEnemyHealth = state.combatState.enemyHealth - action.payload.playerDamage;
        
        return {
            ...state,
            combatState: {
                ...state.combatState,
                playerHealth: Math.max(0, newPlayerHealth),
                enemyHealth: Math.max(0, newEnemyHealth),
                turnLog: [...state.combatState.turnLog, action.payload.log],
            }
        };
    case 'END_COMBAT':
        const characterForPoints = state.selectedCharacterId;
        if (action.payload.victory && characterForPoints) {
            // This is a simplified logic. Quest completion should grant points.
            // Let's assume victory always gives a point for now.
             return {
                ...state,
                screen: 'main-hub',
                skillPoints: {
                    ...state.skillPoints,
                    [characterForPoints]: (state.skillPoints[characterForPoints] || 0) + 1,
                },
                combatState: initialState.combatState,
            };
        }
        return {
            ...state,
            screen: 'main-hub',
            combatState: initialState.combatState,
        };

    case 'RESET_PROGRESS':
        localStorage.removeItem('gameState');
        // Instead of reloading, reset state and let React handle the re-render.
        return {...initialState, screen: 'character-select'};

    default:
      return state;
  }
};

export const GameStateContext = createContext<{ state: GameState; dispatch: Dispatch<Action> } | undefined>(
  undefined
);

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState, (init) => {
        try {
            const stored = localStorage.getItem('gameState');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Basic validation to prevent loading broken state
                if (parsed.screen) {
                    return parsed;
                }
            }
            return init;
        } catch {
            return init;
        }
    });

    useEffect(() => {
        // Prevent writing initial state to local storage on first load if it's already there
        if (state !== initialState) {
            localStorage.setItem('gameState', JSON.stringify(state));
        }
    }, [state]);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};