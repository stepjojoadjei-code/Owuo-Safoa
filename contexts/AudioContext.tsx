import React, { createContext, useState, useRef, useEffect, ReactNode } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (sound: 'click' | 'confirm' | 'error' | 'upgrade' | 'oracle' | 'attack') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const soundEffects = {
  click: 'https://storage.googleapis.com/aethelgard-audio/ui-click.wav',
  confirm: 'https://storage.googleapis.com/aethelgard-audio/ui-confirm.wav',
  error: 'https://storage.googleapis.com/aethelgard-audio/ui-error.wav',
  upgrade: 'https://storage.googleapis.com/aethelgard-audio/ui-upgrade.wav',
  oracle: 'https://storage.googleapis.com/aethelgard-audio/ui-oracle.wav',
  attack: 'https://storage.googleapis.com/aethelgard-audio/ui-attack.wav',
};

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const bgm = new Audio('https://storage.googleapis.com/aethelgard-audio/owuo-safoa-theme.mp3');
    bgm.loop = true;
    bgm.volume = 0.3;
    audioRef.current = bgm;

    const sfx = new Audio();
    sfx.volume = 0.5;
    sfxRef.current = sfx;
    
    const savedMute = localStorage.getItem('owuo-safoa-muted');
    if (savedMute !== null) {
      const muted = JSON.parse(savedMute);
      setIsMuted(muted);
      if(!muted) {
          audioRef.current?.play().catch(() => console.log("User interaction needed to play audio."));
      }
    }

    const handleFirstInteraction = () => {
        if (!isMuted && audioRef.current?.paused) {
            audioRef.current?.play();
        }
        window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);

    return () => {
        window.removeEventListener('click', handleFirstInteraction);
        audioRef.current?.pause();
    }
  }, []);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('owuo-safoa-muted', JSON.stringify(newMutedState));
    if (audioRef.current) {
      if (newMutedState) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const playSound = (sound: keyof typeof soundEffects) => {
    if (!isMuted && sfxRef.current) {
        sfxRef.current.src = soundEffects[sound];
        sfxRef.current.play();
    }
  };


  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </AudioContext.Provider>
  );
};

export { AudioContext };
