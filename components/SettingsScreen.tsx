import React from 'react';
import { useGameState } from '../hooks/useGameState';
import SoundControl from './SoundControl';

const SettingsScreen: React.FC = () => {
    const { dispatch } = useGameState();

    const handleReset = () => {
        if(window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
            dispatch({ type: 'RESET_PROGRESS' });
        }
    }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center bg-background-dark text-white p-4">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      <div className="space-y-6 w-full max-w-md">
        <div className="flex justify-between items-center bg-background-dark/50 p-4 rounded-lg">
            <p className="font-bold">Sound</p>
            <SoundControl />
        </div>
         <div className="flex justify-between items-center bg-background-dark/50 p-4 rounded-lg">
            <p className="font-bold">Reset Progress</p>
            <button onClick={handleReset} className="px-4 py-2 bg-red-600/50 text-red-300 rounded-lg hover:bg-red-600/70 transition-colors">
                Reset
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
