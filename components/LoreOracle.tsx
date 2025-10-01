import React, { useState } from 'react';
import { askOracle } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { useGameState } from '../hooks/useGameState';
import { useTypewriter } from '../hooks/useTypewriter';
import { useAudio } from '../hooks/useAudio';

const LoreOracle: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useGameState();
  const displayedAnswer = useTypewriter(answer, 30);
  const { playSound } = useAudio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setAnswer('');
    playSound('oracle');

    const oracleResponse = await askOracle(question, state.selectedCharacterId);
    
    setAnswer(oracleResponse);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full text-white">
        <div className="flex-grow p-4 bg-black/20 rounded-lg overflow-y-auto">
            <p className="whitespace-pre-wrap">{displayedAnswer}</p>
            {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
            {!isLoading && !answer && <p className="text-gray-400 text-center">Ask the Oracle a question about the world...</p>}
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Whisper your question..."
                className="flex-grow bg-background-light/10 dark:bg-background-dark/30 border border-primary/30 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-600"
            >
                Ask
            </button>
        </form>
    </div>
  );
};

export default LoreOracle;
