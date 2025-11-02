
import React from 'react';
import type { Game } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface GamePlayModalProps {
    game: Game | null;
    onClose: () => void;
}

const GamePlayModal: React.FC<GamePlayModalProps> = ({ game, onClose }) => {
    if (!game) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-95 flex flex-col p-4 z-50 animate-fade-in"
        >
            <header className="flex items-center justify-between p-4 flex-shrink-0">
                 <h2 className="text-2xl text-yellow-300" style={{ textShadow: '0 0 4px rgba(252, 211, 77, 0.7)' }}>
                    Now Playing: {game.title}
                </h2>
                <button 
                    onClick={onClose} 
                    className="text-white hover:text-pink-500 transition-colors"
                >
                    <CloseIcon className="w-10 h-10" />
                </button>
            </header>
            <main className="flex-grow w-full h-full flex items-center justify-center">
                <div className="w-full h-full max-w-6xl aspect-video bg-gray-800 border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50">
                    <iframe
                        src={game.playUrl}
                        title={`Play ${game.title}`}
                        className="w-full h-full"
                        allow="gamepad"
                        allowFullScreen
                    />
                </div>
            </main>
            <style jsx="true">{`
              @keyframes fade-in {
                0% { opacity: 0; }
                100% { opacity: 1; }
              }
              .animate-fade-in { animation: fade-in 0.3s ease-in forwards; }
            `}</style>
        </div>
    );
};

export default GamePlayModal;
