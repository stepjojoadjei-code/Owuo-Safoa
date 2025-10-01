import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on new text
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
        if (i > text.length -1) {
          clearInterval(intervalId);
        }
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [text, speed]);

  return displayedText;
};
