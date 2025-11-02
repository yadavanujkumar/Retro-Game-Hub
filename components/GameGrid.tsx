
import React from 'react';
import type { Game } from '../types';
import GameCard from './GameCard';

interface GameGridProps {
    games: Game[];
    onSelectGame: (game: Game) => void;
    favorites: number[];
}

const GameGrid: React.FC<GameGridProps> = ({ games, onSelectGame, favorites }) => {
    if (games.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No games found.</p>
                <p>Try adjusting your search or filters!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {games.map((game) => (
                <GameCard 
                    key={game.id} 
                    game={game} 
                    onSelect={onSelectGame}
                    isFavorite={favorites.includes(game.id)} 
                />
            ))}
        </div>
    );
};

export default GameGrid;
