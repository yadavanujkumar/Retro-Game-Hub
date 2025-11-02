
import React, { useState } from 'react';
import { MagicIcon } from './icons/MagicIcon';

interface AddGameFormProps {
    onAddGame: (title: string) => void;
    loading: boolean;
    error: string | null;
}

const AddGameForm: React.FC<AddGameFormProps> = ({ onAddGame, loading, error }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && !loading) {
            onAddGame(title.trim());
            setTitle('');
        }
    };

    return (
        <section className="mb-12 p-6 border-2 border-dashed border-cyan-400 rounded-lg bg-gray-800/50 shadow-lg">
            <h2 className="text-2xl text-yellow-300 mb-4 text-center" style={{ textShadow: '0 0 4px rgba(252, 211, 77, 0.7)' }}>Summon a New Game!</h2>
            <p className="text-center text-gray-400 mb-6">
                Enter the title of a classic game and let our AI add it to the arcade.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., 'Earthworm Jim'"
                    className="w-full sm:w-1/2 bg-gray-900 border-2 border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-md px-4 py-2 text-white placeholder-gray-500 transition-colors"
                    disabled={loading}
                    aria-label="Game Title"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative inline-flex items-center justify-center px-6 py-2 text-lg font-bold text-white bg-pink-500 border-2 border-pink-500 rounded-md hover:bg-transparent disabled:bg-gray-600 disabled:border-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
                >
                     <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-pink-500 rounded-full group-hover:w-full group-hover:h-32 opacity-20"></span>
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <MagicIcon className="w-5 h-5 mr-2" />
                            Generate Game
                        </>
                    )}
                </button>
            </form>
            {error && <p role="alert" className="text-center text-red-500 mt-4">{error}</p>}
        </section>
    );
};

export default AddGameForm;
