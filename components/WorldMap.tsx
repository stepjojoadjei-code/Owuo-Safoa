import React, { useState, useEffect } from 'react';
import { Location } from '../types';
import { locations } from '../data/gameData';
import { generateLocationImage } from '../services/geminiService';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import LoadingSpinner from './LoadingSpinner';

interface WorldMapProps {
    onLocationSelect: (location: Location) => void;
    selectedLocation: Location | null;
}

const WorldMap: React.FC<WorldMapProps> = ({ onLocationSelect, selectedLocation }) => {
    const [bgImage, setBgImage] = useLocalStorageState<string | null>(`location-bg-${selectedLocation?.id}`, null);
    const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
        if (selectedLocation && !bgImage) {
            setIsLoading(true);
            generateLocationImage(selectedLocation.name)
                .then(imageUrl => {
                    setBgImage(imageUrl);
                })
                .catch(err => console.error(err))
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [selectedLocation, bgImage, setBgImage]);

    // Effect to clear bgImage when location changes to force re-evaluation
    useEffect(() => {
        // This is handled by the dynamic key in useLocalStorageState
    }, [selectedLocation]);

    return (
        <div className="relative h-full w-full rounded-lg border border-primary/20 bg-black overflow-hidden">
            {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20"><LoadingSpinner /></div>}
            
            <div 
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{ 
                    backgroundImage: `url(${bgImage || ''})`,
                    opacity: bgImage && !isLoading ? 0.7 : 0,
                    animation: bgImage && !isLoading ? 'ken-burns 30s ease-in-out infinite alternate' : 'none',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/50 to-transparent"></div>

            {locations.map(location => (
                <button
                    key={location.id}
                    onClick={() => onLocationSelect(location)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-primary hover:scale-110 transition-transform z-10 shadow-lg"
                    style={{ top: location.mapPosition.top, left: location.mapPosition.left }}
                    aria-label={`Select ${location.name}`}
                >
                    <span className="material-symbols-outlined text-white">
                        {selectedLocation?.id === location.id ? 'fmd_good' : 'location_on'}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default WorldMap;