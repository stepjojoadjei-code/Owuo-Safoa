import React from 'react';
import { Location } from '../types';
import WorldMap from './WorldMap';
import MapDetailPanel from './MapDetailPanel';
import { locations } from '../data/gameData';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const QuestMapScreen: React.FC = () => {
    const [selectedLocation, setSelectedLocation] = useLocalStorageState<Location | null>('selectedLocation', locations[0] || null);

    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location);
    };

    return (
        <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-white">
            <div className="md:col-span-2 h-[50vh] md:h-full">
                <WorldMap onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />
            </div>
            <div className="md:col-span-1 h-[40vh] md:h-full overflow-y-auto">
                {selectedLocation ? (
                    <MapDetailPanel location={selectedLocation} />
                ) : (
                    <div className="h-full flex items-center justify-center bg-background-dark/50 rounded-lg">
                        <p>Select a location on the map.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestMapScreen;
