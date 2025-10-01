import React from 'react';
import { Location } from '../types';

interface GenerativeBackgroundProps {
    location: Location;
    onGenerationStart: () => void;
    onGenerationEnd: () => void;
}

const GenerativeBackground: React.FC<GenerativeBackgroundProps> = ({ location }) => {
    // A simple placeholder background
    return <div className="absolute inset-0 bg-background-dark -z-10" />;
};

export default GenerativeBackground;
