import React from 'react';
import { Location, Quest } from '../types';
import { quests } from '../data/gameData';
import { useGameState } from '../hooks/useGameState';
import { enemies } from '../data/gameData';

interface MapDetailPanelProps {
    location: Location;
}

const MapDetailPanel: React.FC<MapDetailPanelProps> = ({ location }) => {
    const { state, dispatch } = useGameState();
    const locationQuests = quests.filter(q => q.locationId === location.id && !state.completedQuests.includes(q.id));

    const handleQuest = (quest: Quest) => {
        if (quest.triggersCombat && quest.enemyId) {
            const enemy = enemies.find(e => e.id === quest.enemyId);
            if (enemy) {
                dispatch({ type: 'START_COMBAT', payload: enemy });
            }
        } else {
            // Handle non-combat quests
            console.log('Non-combat quest started:', quest.title);
        }
    };

    return (
        <div className="h-full bg-background-dark/50 p-4 text-white rounded-lg backdrop-blur-sm overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary border-b border-primary/20 pb-2 mb-4">{location.name}</h2>
            {locationQuests.length > 0 ? (
                <div className="space-y-4">
                    {locationQuests.map(quest => (
                        <div key={quest.id} className="bg-black/20 p-3 rounded-lg">
                            <h3 className="font-bold">{quest.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">{quest.description}</p>
                            <button onClick={() => handleQuest(quest)} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                                {quest.triggersCombat ? 'Engage' : 'Investigate'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No active quests in this region. The lands are quiet... for now.</p>
            )}
        </div>
    );
};

export default MapDetailPanel;
