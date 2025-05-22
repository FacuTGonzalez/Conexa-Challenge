import { Character } from "@/models/characters.model";

export const extractEpisodeIdFromCharacter = (character: Character | null): string[] => {
    if (!character) return [];

    const ids = character.episode.map(e => {
        const parts = e.split('/');
        return parts[parts.length - 1];
    });

    // Eliminar duplicados usando Set
    const uniqueIds = [...new Set(ids)];

    return uniqueIds;
};

export const matchEpisodes = (firstEpisodes: string[], secondEpisodes: string[]): string[] => {
    if (!firstEpisodes.length || !secondEpisodes.length) {
        return [];
    }

    const [smallerArray, largerArray] = firstEpisodes.length <= secondEpisodes.length 
        ? [firstEpisodes, secondEpisodes] 
        : [secondEpisodes, firstEpisodes];
    
    const episodeSet = new Set(smallerArray);
    
    return largerArray.filter(episode => episodeSet.has(episode));
};