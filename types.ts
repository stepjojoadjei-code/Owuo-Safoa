export interface Ability {
  id: string;
  name: string;
  description: string;
  loreId?: string;
  requires?: string;
  damage?: number;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  skillTree: Ability[];
  baseHealth: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  locationId: string;
  loreId: string;
  skillPointReward: number;
  triggersCombat?: boolean;
  enemyId?: string;
}

export interface Enemy {
  id: string;
  name: string;
  imageUrl: string;
  health: number;
  attackName: string;
  attackDamage: number;
}

export interface Location {
  id: string;
  name: string;
  mapPosition: { top: string; left: string };
}

export interface LoreEntry {
  id: string;
  title: string;
  category: string;
  content: string;
}

export interface ToastData {
  id: string;
  type: 'lore' | 'quest' | 'error';
  content: string;
}

// Global Game State
export type Screen = 'character-select' | 'main-hub' | 'combat';
export type MainHubTab = 'home' | 'lore' | 'quest' | 'inventory' | 'settings';

export interface CombatState {
  isActive: boolean;
  enemy: Enemy | null;
  playerHealth: number;
  enemyHealth: number;
  turnLog: string[];
}

export interface GameState {
  screen: Screen;
  selectedCharacterId: string | null;
  unlockedSkills: { [characterId: string]: string[] };
  skillPoints: { [characterId: string]: number };
  unlockedLore: string[];
  readLore: string[];
  activeQuests: string[];
  completedQuests: string[];
  toastMessage: ToastData | null;
  combatState: CombatState;
}
