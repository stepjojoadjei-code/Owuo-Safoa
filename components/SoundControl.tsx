import React from 'react';
import { useAudio } from '../hooks/useAudio';

const SoundControl: React.FC = () => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <button
      onClick={toggleMute}
      className="p-2 rounded-full hover:bg-primary/20 transition-colors"
    >
      {isMuted ? (
        <span className="material-symbols-outlined text-gray-400">volume_off</span>
      ) : (
        <span className="material-symbols-outlined text-primary">volume_up</span>
      )}
    </button>
  );
};

export default SoundControl;
