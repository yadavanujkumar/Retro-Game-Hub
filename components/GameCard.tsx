import React, { useState } from 'react';
import type { Game } from '../types';
import { HeartIcon } from './icons/HeartIcon';
import { NoImageIcon } from './icons/NoImageIcon';

interface GameCardProps {
    game: Game;
    onSelect: (game: Game) => void;
    isFavorite: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelect, isFavorite }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div 
            className="group relative cursor-pointer aspect-[3/4] transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => onSelect(game)}
        >
            <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
            <div className="relative w-full h-full border-2 border-transparent group-hover:border-cyan-400 shadow-lg group-hover:shadow-2xl group-hover:shadow-cyan-500/50 transition-all duration-300 bg-gray-800">
                {imageError ? (
                     <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-2">
                        <NoImageIcon className="w-12 h-12 mb-2" />
                        <span className="text-xs text-center">Image not found</span>
                    </div>
                ) : (
                    <img 
                        src={game.coverUrl} 
                        alt={`${game.title} cover`} 
                        className="w-full h-full object-cover" 
                        onError={handleImageError}
                    />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-70 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-xs font-bold truncate">{game.title}</h3>
                </div>
                 {isFavorite && (
                    <div className="absolute top-1 right-1 text-pink-500 drop-shadow-lg">
                        <HeartIcon className="w-5 h-5" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameCard;
