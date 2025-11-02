import { GoogleGenAI, Type } from "@google/genai";
import type { Game } from '../types';

export interface GameDetails {
    description: string;
    funFacts: string[];
}

const parseResponse = (text: string): GameDetails => {
    const descriptionMatch = text.match(/DESCRIPTION:(.*?)\nFUNFACTS:/s);
    const funFactsMatch = text.match(/FUNFACTS:(.*)/s);

    const description = descriptionMatch ? descriptionMatch[1].trim() : "Could not generate a description.";
    const funFacts = funFactsMatch ? funFactsMatch[1].split('|').map(fact => fact.trim()).filter(fact => fact) : ["Could not generate fun facts."];
    
    return { description, funFacts };
}


export const generateGameDetails = async (gameTitle: string): Promise<GameDetails> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `
Generate a short, nostalgic description and three fun facts for the retro video game "${gameTitle}".
The description should capture the essence of the game for someone who played it in the 80s or 90s.
The fun facts should be interesting and concise.

Provide the output in the following format exactly, with no other text or markdown formatting:
DESCRIPTION: [Your nostalgic description here.]
FUNFACTS: [Fun fact 1] | [Fun fact 2] | [Fun fact 3]
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text;
        if (!text) {
            throw new Error("Empty response from API");
        }
        
        return parseResponse(text);

    } catch (error) {
        console.error("Error generating game details:", error);
        return {
            description: "Failed to generate a description. The AI might be taking a coffee break. Please try again later.",
            funFacts: ["Error fetching data from the digital ether."]
        };
    }
};

export const generateNewGame = async (gameTitle: string, existingGames: Game[]): Promise<Game> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `
            Generate data for the retro video game "${gameTitle}".
            You must find:
            1. The original release year.
            2. The game's primary genre.
            3. A direct, publicly accessible URL for the game's box art. Prioritize images from 'cdn.thegamesdb.net'. The URL must end in a common image file extension (e.g., .jpg, .png). Do NOT provide a URL to a webpage.
            4. A URL to a web-based emulator where the game can be played (preferably from retrogames.cz or a similar trusted site).

            Return the data as a single, minified JSON object with no markdown formatting. The title key should be the official title of the game.
            The JSON keys must be: "title", "year", "genre", "coverUrl", "playUrl".
        `;
        
        const newId = (existingGames.length > 0 ? Math.max(...existingGames.map(g => g.id)) : 0) + 1;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        year: { type: Type.INTEGER },
                        genre: { type: Type.STRING },
                        coverUrl: { type: Type.STRING },
                        playUrl: { type: Type.STRING },
                    },
                    required: ["title", "year", "genre", "coverUrl", "playUrl"],
                },
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error("Empty response from API");
        }
        
        const gameData = JSON.parse(text);

        return {
            id: newId,
            ...gameData,
        };

    } catch (error) {
        console.error("Error generating new game:", error);
        throw new Error(`Failed to generate data for "${gameTitle}". The AI may be busy polishing its high scores.`);
    }
};