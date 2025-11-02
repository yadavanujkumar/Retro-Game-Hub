
import React, { useState, useEffect } from 'react';
import type { Game } from '../types';
import { generateGameDetails, GameDetails } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';
import { PlayIcon } from './icons/PlayIcon';
import { HeartIcon } from './icons/HeartIcon';
import { HeartOutlineIcon } from './icons/HeartOutlineIcon';
import { NoImageIcon } from './icons/NoImageIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

interface GameDetailModalProps {
    game: Game | null;
    onClose: () => void;
    onPlay: (game: Game) => void;
    favorites: number[];
    onToggleFavorite: (gameId: number) => void;
    onUpdateGame: (game: Game) => void;
    onDeleteGame: (gameId: number) => void;
}

const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, onClose, onPlay, favorites, onToggleFavorite, onUpdateGame, onDeleteGame }) => {
    const [details, setDetails] = useState<GameDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedGame, setEditedGame] = useState<Game | null>(null);

    useEffect(() => {
        if (game) {
            setLoading(true);
            setDetails(null);
            setImageError(false);
            setIsEditing(false); // Reset edit mode when game changes
            setEditedGame(game);
            const fetchDetails = async () => {
                const generatedDetails = await generateGameDetails(game.title);
                setDetails(generatedDetails);
                setLoading(false);
            };
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            fetchDetails();
        }
    }, [game]);

    if (!game) return null;
    
    const handleImageError = () => {
        setImageError(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editedGame) return;
        const { name, value } = e.target;
        setEditedGame({ ...editedGame, [name]: name === 'year' ? parseInt(value, 10) || 0 : value });
    };

    const handleSave = () => {
        if (editedGame) {
            onUpdateGame(editedGame);
            setIsEditing(false);
        }
    };

    const isFavorite = favorites.includes(game.id);
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="relative bg-gray-900 border-2 border-pink-500 shadow-2xl shadow-pink-500/50 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-white hover:text-pink-500 transition-colors z-10"
                    aria-label="Close"
                >
                    <CloseIcon className="w-8 h-8" />
                </button>

                <div className="w-full md:w-1/3 flex-shrink-0 bg-gray-800 rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                     {imageError && !isEditing ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4">
                            <NoImageIcon className="w-24 h-24 mb-4" />
                            <span className="text-center">Could not load cover art</span>
                        </div>
                    ) : (
                        <img 
                            src={isEditing ? editedGame?.coverUrl : game.coverUrl} 
                            alt={game.title} 
                            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none" 
                            onError={handleImageError}
                        />
                    )}
                </div>

                <div className="p-6 text-sm overflow-y-auto flex-grow">
                     {isEditing ? (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label htmlFor="title" className="block text-xs font-medium text-cyan-400">Title</label>
                                <input type="text" name="title" id="title" value={editedGame?.title} onChange={handleEditChange} className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-1 mt-1"/>
                            </div>
                             <div>
                                <label htmlFor="year" className="block text-xs font-medium text-cyan-400">Year</label>
                                <input type="number" name="year" id="year" value={editedGame?.year} onChange={handleEditChange} className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-1 mt-1"/>
                            </div>
                             <div>
                                <label htmlFor="genre" className="block text-xs font-medium text-cyan-400">Genre</label>
                                <input type="text" name="genre" id="genre" value={editedGame?.genre} onChange={handleEditChange} className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-1 mt-1"/>
                            </div>
                             <div>
                                <label htmlFor="coverUrl" className="block text-xs font-medium text-cyan-400">Cover URL</label>
                                <input type="text" name="coverUrl" id="coverUrl" value={editedGame?.coverUrl} onChange={handleEditChange} className="w-full bg-gray-800 border-2 border-gray-700 rounded-md px-3 py-1 mt-1"/>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-colors">Save</button>
                                <button onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl md:text-3xl text-yellow-300 mb-2" style={{ textShadow: '0 0 4px rgba(252, 211, 77, 0.7)' }}>{game.title}</h2>
                            <p className="text-gray-400 mb-4">{game.year} &bull; {game.genre}</p>
                            
                            <div className="flex items-center flex-wrap gap-4 mb-6">
                                <button onClick={() => onPlay(game)} className="group relative inline-flex items-center justify-center px-4 py-2 text-lg font-bold text-white bg-green-500 border-2 border-green-500 rounded-md hover:bg-transparent transition-colors duration-300">
                                    <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-green-500 rounded-full group-hover:w-full group-hover:h-32 opacity-20"></span>
                                    <PlayIcon className="w-5 h-5 mr-2" /> Play Now
                                </button>
                                <button onClick={() => onToggleFavorite(game.id)} className={`flex items-center justify-center p-2 rounded-md transition-colors duration-300 ${isFavorite ? 'bg-pink-500 text-white border-2 border-pink-500 hover:bg-transparent' : 'bg-transparent text-pink-500 border-2 border-pink-500 hover:bg-pink-500 hover:text-white'}`} aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                                    {isFavorite ? <HeartIcon className="w-5 h-5" /> : <HeartOutlineIcon className="w-5 h-5" />}
                                </button>
                                <button onClick={() => setIsEditing(true)} className="flex items-center justify-center p-2 bg-transparent text-cyan-400 border-2 border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-white transition-colors duration-300" aria-label="Edit game">
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => onDeleteGame(game.id)} className="flex items-center justify-center p-2 bg-transparent text-red-500 border-2 border-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300" aria-label="Delete game">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {loading ? (
                                <div className="space-y-4 pt-4"><p className="text-cyan-400 animate-pulse">Accessing archives... generating nostalgia...</p><div className="w-full h-4 bg-gray-700 rounded-full animate-pulse"></div><div className="w-3/4 h-4 bg-gray-700 rounded-full animate-pulse"></div><div className="w-1/2 h-4 bg-gray-700 rounded-full animate-pulse"></div></div>
                            ) : details && (
                                <div className="animate-fade-in"><h3 className="text-lg text-pink-500 mb-2">DESCRIPTION:</h3><p className="text-gray-300 mb-6 leading-relaxed">{details.description}</p><h3 className="text-lg text-pink-500 mb-2">FUN FACTS:</h3><ul className="list-disc list-inside text-gray-300 space-y-2">{details.funFacts.map((fact, index) => (<li key={index}>{fact}</li>))}</ul></div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <style jsx="true">{`
              @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
              @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
              .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
              .animate-fade-in { animation: fade-in 0.5s ease-in forwards; }
              input { color: white; }
            `}</style>
        </div>
    );
};

export default GameDetailModal;
