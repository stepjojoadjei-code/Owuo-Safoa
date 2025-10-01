import { Character, Enemy, Location, LoreEntry, Quest } from '../types';

export const characters: Character[] = [
  {
    id: 'kiera',
    name: 'Kiera',
    title: 'The Shadow Whisper',
    description: 'A nimble rogue who walks unseen, striking from the shadows with deadly precision. Her past is as veiled as her movements.',
    imageUrl: 'https://storage.googleapis.com/aethelgard-images/kiera.png',
    baseHealth: 80,
    skillTree: [
      { id: 'shadow_strike', name: 'Shadow Strike', description: 'A swift, powerful attack from the shadows.', damage: 20 },
      { id: 'evasive_maneuver', name: 'Evasive Maneuver', description: 'Dodge the next attack.', requires: 'shadow_strike', damage: 5 },
      { id: 'venom_blades', name: 'Venom Blades', description: 'Coat blades in poison, dealing extra damage over time.', requires: 'shadow_strike', damage: 15 },
      { id: 'smoke_bomb', name: 'Smoke Bomb', description: 'Disappear in a cloud of smoke, confusing the enemy.', requires: 'evasive_maneuver', damage: 10 },
    ],
  },
  {
    id: 'gorok',
    name: 'Gorok',
    title: 'The Mountainheart',
    description: 'A stoic warrior whose strength is matched only by his loyalty. He carries the weight of his ancestors\' legacy on his broad shoulders.',
    imageUrl: 'https://storage.googleapis.com/aethelgard-images/gorok.png',
    baseHealth: 120,
    skillTree: [
      { id: 'sunder', name: 'Sunder', description: 'A mighty blow that weakens enemy armor.', damage: 15 },
      { id: 'shield_bash', name: 'Shield Bash', description: 'Stun an enemy with a powerful shield strike.', requires: 'sunder', damage: 10 },
      { id: 'ancestral_fury', name: 'Ancestral Fury', description: 'Unleash a flurry of powerful attacks.', requires: 'sunder', damage: 25 },
      { id: 'stone_form', name: 'Stone Form', description: 'Harden your skin, reducing incoming damage.', requires: 'shield_bash', damage: 5 },
    ],
  },
];

export const enemies: Enemy[] = [
    {
        id: 'goblin_reaver',
        name: 'Goblin Reaver',
        imageUrl: 'https://storage.googleapis.com/aethelgard-images/goblin.png',
        health: 50,
        attackName: 'Rusty Shank',
        attackDamage: 10,
    },
    {
        id: 'dire_wolf',
        name: 'Dire Wolf',
        imageUrl: 'https://storage.googleapis.com/aethelgard-images/wolf.png',
        health: 70,
        attackName: 'Vicious Bite',
        attackDamage: 15,
    }
];

export const locations: Location[] = [
    { id: 'whispering_woods', name: 'Whispering Woods', mapPosition: { top: '30%', left: '25%' } },
    { id: 'ironpeak_citadel', name: 'Ironpeak Citadel', mapPosition: { top: '50%', left: '70%' } },
    { id: 'sunken_crypt', name: 'The Sunken Crypt', mapPosition: { top: '75%', left: '40%' } },
];

export const loreEntries: LoreEntry[] = [
    { id: 'creation_myth', title: 'The Creation Myth', category: 'World History', content: 'In the beginning, there was only the silent song of the cosmos...'},
    { id: 'ironpeak_history', title: 'History of Ironpeak', category: 'Locations', content: 'Ironpeak Citadel was carved from the mountain by the first kings of men...'},
    { id: 'shadow_whisperers', title: 'The Shadow Whisperers', category: 'Factions', content: 'An ancient guild of assassins and spies, their allegiances are known only to themselves.'},
    { id: 'goblin_tribes', title: 'Goblin Tribes', category: 'Bestiary', content: 'Goblins are a scourge upon the land, often found in dark woods and forgotten ruins.'},
];

export const quests: Quest[] = [
    { id: 'reaver_hunt', title: 'Reaver Hunt', description: 'Goblins have been spotted in the Whispering Woods. Thin their numbers.', locationId: 'whispering_woods', loreId: 'goblin_tribes', skillPointReward: 1, triggersCombat: true, enemyId: 'goblin_reaver' },
    { id: 'citadel_secrets', title: 'Citadel Secrets', description: 'Explore the Ironpeak Citadel and uncover its hidden history.', locationId: 'ironpeak_citadel', loreId: 'ironpeak_history', skillPointReward: 1 },
];
