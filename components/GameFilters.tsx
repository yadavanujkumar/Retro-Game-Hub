
import React from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { FilterIcon } from './icons/FilterIcon';

interface GameFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedGenre: string;
    onGenreChange: (genre: string) => void;
    genres: string[];
}

const GameFilters: React.FC<GameFiltersProps> = ({ 
    searchQuery, 
    onSearchChange, 
    selectedGenre, 
    onGenreChange, 
    genres 
}) => {
    return (
        <section className="mb-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <label htmlFor="search-game" className="sr-only">Search Games</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        id="search-game"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search for a game..."
                        className="w-full bg-gray-900 border-2 border-gray-700 focus:border-cyan-500 focus:ring-cyan-500 rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-500 transition-colors"
                    />
                </div>
                <div className="relative">
                    <label htmlFor="genre-filter" className="sr-only">Filter by Genre</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <FilterIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                        id="genre-filter"
                        value={selectedGenre}
                        onChange={(e) => onGenreChange(e.target.value)}
                        className="w-full appearance-none bg-gray-900 border-2 border-gray-700 focus:border-cyan-500 focus:ring-cyan-500 rounded-md pl-10 pr-4 py-2 text-white transition-colors"
                    >
                        {genres.map(genre => (
                            <option key={genre} value={genre}>
                                {genre === 'All' ? 'All Genres' : genre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
};

export default GameFilters;
