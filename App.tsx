
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import GameGrid from './components/GameGrid';
import GameDetailModal from './components/GameDetailModal';
import GamePlayModal from './components/GamePlayModal';
import AddGameForm from './components/AddGameForm';
import GameFilters from './components/GameFilters';
import { GAMES } from './constants';
import type { Game } from './types';
import { HeartIcon } from './components/icons/HeartIcon';
import { generateNewGame } from './services/geminiService';

const App: React.FC = () => {
    const [games, setGames] = useState<Game[]>(GAMES);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [playingGame, setPlayingGame] = useState<Game | null>(null);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isAddingGame, setIsAddingGame] = useState(false);
    const [addGameError, setAddGameError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');

    const handleSelectGame = (game: Game) => {
        setSelectedGame(game);
    };

    const handleCloseModal = () => {
        setSelectedGame(null);
    };

    const handlePlayGame = (game: Game) => {
        setSelectedGame(null); // Close detail modal
        setPlayingGame(game);
    };
    
    const handleClosePlayModal = () => {
        setPlayingGame(null);
    };

    const handleToggleFavorite = (gameId: number) => {
        setFavorites(prevFavorites => {
            if (prevFavorites.includes(gameId)) {
                return prevFavorites.filter(id => id !== gameId);
            } else {
                return [...prevFavorites, gameId];
            }
        });
    };

    const handleAddGame = async (title: string) => {
        setIsAddingGame(true);
        setAddGameError(null);
        try {
            const newGame = await generateNewGame(title, games);
            if (games.some(g => g.title.toLowerCase() === newGame.title.toLowerCase())) {
                 setAddGameError(`"${newGame.title}" is already in the arcade!`);
            } else {
                 setGames(prevGames => [...prevGames, newGame]);
            }
        } catch (error) {
            if (error instanceof Error) {
                setAddGameError(error.message);
            } else {
                setAddGameError("An unknown error occurred while summoning the game.");
            }
        } finally {
            setIsAddingGame(false);
        }
    };
    
    const handleUpdateGame = (updatedGame: Game) => {
        setGames(prevGames => prevGames.map(game => game.id === updatedGame.id ? updatedGame : game));
        setSelectedGame(updatedGame); // Keep modal open with updated info
    };

    const handleDeleteGame = (gameId: number) => {
        if (window.confirm("Are you sure you want to delete this game from the arcade?")) {
            setGames(prevGames => prevGames.filter(game => game.id !== gameId));
            setFavorites(prevFavorites => prevFavorites.filter(id => id !== gameId));
            handleCloseModal();
        }
    };


    const genres = useMemo(() => ['All', ...new Set(games.map(g => g.genre).sort())], [games]);

    const favoriteGames = useMemo(() => {
        return games.filter(game => favorites.includes(game.id));
    }, [favorites, games]);
    
    const filteredFavoriteGames = useMemo(() => {
        return favoriteGames
            .filter(game => selectedGenre === 'All' || game.genre === selectedGenre)
            .filter(game => game.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [favoriteGames, searchQuery, selectedGenre]);

    const filteredGames = useMemo(() => {
        return games
            .filter(game => selectedGenre === 'All' || game.genre === selectedGenre)
            .filter(game => game.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [games, searchQuery, selectedGenre]);


    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
            <div className="container mx-auto">
                <Header />
                <main>
                    <AddGameForm onAddGame={handleAddGame} loading={isAddingGame} error={addGameError} />
                    
                    <GameFilters 
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedGenre={selectedGenre}
                        onGenreChange={setSelectedGenre}
                        genres={genres}
                    />

                    {favoriteGames.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl md:text-3xl text-yellow-300 mb-6 text-center flex items-center justify-center" style={{ textShadow: '0 0 4px rgba(252, 211, 77, 0.7)' }}>
                                <HeartIcon className="w-6 h-6 mr-3 text-pink-500"/>
                                My Favorites
                                <HeartIcon className="w-6 h-6 ml-3 text-pink-500"/>
                            </h2>
                            <GameGrid games={filteredFavoriteGames} onSelectGame={handleSelectGame} favorites={favorites} />
                            <hr className="my-12 border-t-2 border-dashed border-gray-700" />
                        </section>
                    )}
                    
                    <p className="text-center text-cyan-400 mb-8 text-sm md:text-base animate-pulse">Select a game to see AI-generated details!</p>
                    <GameGrid games={filteredGames} onSelectGame={handleSelectGame} favorites={favorites} />
                </main>
            </div>
            <GameDetailModal 
                game={selectedGame} 
                onClose={handleCloseModal} 
                onPlay={handlePlayGame}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onUpdateGame={handleUpdateGame}
                onDeleteGame={handleDeleteGame}
            />
            <GamePlayModal game={playingGame} onClose={handleClosePlayModal} />
        </div>
    );
};

export default App;
