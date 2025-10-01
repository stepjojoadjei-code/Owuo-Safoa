// @google/genai API client
import { GoogleGenAI } from "@google/genai";
import { Character, Ability, Enemy } from '../types';
import { characters } from '../data/gameData';

// FIX: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askOracle = async (question: string, characterId: string | null): Promise<string> => {
    try {
        const characterContext = characterId ? characters.find(c => c.id === characterId) : null;
        const systemInstruction = `You are a mysterious and wise oracle in the fantasy world of Aethelgard. 
        Your answers are cryptic, poetic, and steeped in the lore of the land. 
        The user is a player in this world, currently playing as ${characterContext?.name || 'an unknown hero'}. 
        Answer their questions about the world, its history, creatures, and magic, but never break character.
        Keep your answers concise, to a maximum of 3-4 sentences.`;

        // FIX: Use ai.models.generateContent for text generation.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: question,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.8,
                topP: 0.9,
            }
        });

        // FIX: Access the generated text directly from the .text property.
        return response.text;
    } catch (error) {
        console.error("Error asking the oracle:", error);
        return "The ether is clouded... The oracle is silent now. Try again later.";
    }
};

export const generateCombatTurn = async (character: Character, ability: Ability, enemy: Enemy): Promise<string> => {
    try {
        const prompt = `In the fantasy world of Aethelgard, describe a combat turn in a dramatic, third-person narrative style.
        The hero, ${character.name}, ${character.title}, uses the ability "${ability.name}".
        Description of the ability: "${ability.description}".
        Their opponent is a ${enemy.name}.
        Describe the hero's action and the immediate effect on the ${enemy.name}.
        Keep the description to a single, impactful sentence.`;

        // FIX: Use ai.models.generateContent for text generation.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.9,
                topP: 1.0,
                // FIX: Disable thinking for low-latency use cases like combat narration.
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        
        // FIX: Access the generated text directly from the .text property.
        return response.text;
    } catch (error) {
        console.error("Error generating combat turn:", error);
        return `${character.name} uses ${ability.name}! It strikes the ${enemy.name}!`;
    }
};

export const generateLocationImage = async (locationName: string): Promise<string> => {
    try {
        const prompt = `A breathtaking, epic fantasy digital painting of a location known as ${locationName}. Moody, atmospheric lighting, hyper-detailed, trending on ArtStation, cinematic composition.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error(`Error generating image for ${locationName}:`, error);
        return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkMiBb80jbPWkDaeslTFh8ej0lgU2rV1Twka9K1-bL51Q3WRPu0j7njZi-bgr4yWSbcz0sXZylqosdu4GwyXramrfLEruoJWxVI7zv6Rqf0VMkvQP5vBVsuUUmWWVdzcJHh9_2IHuOj4oS-pwgWPkSlCCb-DgnMqdANj95KnN_tfKmfeN6njtpxYoyZ-GWP8gmwO-6yHHuU52yA9zUg0d-R0YfToiGmOBJSB8hWZHd5_gw5iGndDxsGyMWKCK5aO_xtsVBaqSonA';
    }
};