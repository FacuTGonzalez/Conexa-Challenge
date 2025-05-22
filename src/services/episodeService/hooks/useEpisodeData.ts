import { extractEpisodeIdFromCharacter, matchEpisodes } from "@/utils/episodesHelper";
import { useMemo } from "react";
import { useGetEpisodes } from "./useGetEpisodes";
import { Episode } from "@/models/episodes.model";
import { Character } from "@/models/characters.model";

interface EpisodeData {
  firstCharacterEpisodes: Episode[] | null;
  secondCharacterEpisodes: Episode[] | null;
  matchedCharacterEpisodes: Episode[] | null;
  bothCharactersSelected: boolean;
}

const useEpisodeData = (
  firstCharacter: Character | null,
  secondCharacter: Character | null
): EpisodeData => {
  const firstCharacterId = firstCharacter?.id;
  const secondCharacterId = secondCharacter?.id;

  const bothCharactersSelected = !!(firstCharacterId && secondCharacterId);

  const firstIds = useMemo(() => {
    return firstCharacter ? extractEpisodeIdFromCharacter(firstCharacter) : [];
  }, [firstCharacterId]);

  const secondIds = useMemo(() => {
    return secondCharacter ? extractEpisodeIdFromCharacter(secondCharacter) : [];
  }, [secondCharacterId]);

  const matchedIds = useMemo(() => {
    if (!bothCharactersSelected) return [];
    return matchEpisodes(firstIds, secondIds);
  }, [bothCharactersSelected, firstIds.join(","), secondIds.join(",")]);
  
  const episodeParams = useMemo(() => ({ page: 1 }), []);

  const { episodes: firstCharacterEpisodes } = useGetEpisodes({
    id: bothCharactersSelected ? firstIds : [],
    params: episodeParams,
  });

  const { episodes: secondCharacterEpisodes } = useGetEpisodes({
    id: bothCharactersSelected ? secondIds : [],
    params: episodeParams,
  });

  const { episodes: matchedCharacterEpisodes } = useGetEpisodes({
    id: bothCharactersSelected ? matchedIds : [],
    params: episodeParams,
  });

  return {
    firstCharacterEpisodes: bothCharactersSelected ? firstCharacterEpisodes : null,
    secondCharacterEpisodes: bothCharactersSelected ? secondCharacterEpisodes : null,
    matchedCharacterEpisodes: bothCharactersSelected && matchedIds.length > 0 ? matchedCharacterEpisodes : null,
    bothCharactersSelected,
  };
};

export default useEpisodeData;
