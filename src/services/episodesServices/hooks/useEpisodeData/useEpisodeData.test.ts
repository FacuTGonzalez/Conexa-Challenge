import { renderHook } from '@testing-library/react';
import * as useGetEpisodesModule from '../useGetEpisodes/useGetEpisodes';
import * as helperModule from '@/utils/episodesHelper';
import { Character } from '@/models/characters.model';
import { Episode } from '@/models/episodes.model';
import useEpisodeData from './useEpisodeData';

// Mock de datos
const mockEpisodes: Episode[] = [
  { id: 1, episode: 'S01E01', name: 'Episode 1', air_date: 'Jan 1', characters: [], url: '', created: '' },
  { id: 2, episode: 'S01E02', name: 'Episode 2', air_date: 'Jan 2', characters: [], url: '', created: '' }
];

const mockCharacter1: Character = {
  id: 1,
  name: 'Rick',
  episode: ['https://api.com/episode/1', 'https://api.com/episode/2'],
  // otros campos si los tenés
} as Character;

const mockCharacter2: Character = {
  id: 2,
  name: 'Morty',
  episode: ['https://api.com/episode/1'],
} as Character;

// Mocks globales
jest.mock('../useGetEpisodes/useGetEpisodes');
jest.mock('@/utils/episodesHelper', () => ({
  extractEpisodeIdFromCharacter: jest.fn(),
  matchEpisodes: jest.fn()
}));

describe('useEpisodeData', () => {
  const mockedUseGetEpisodes = useGetEpisodesModule.useGetEpisodes as jest.Mock;
  const mockedExtract = helperModule.extractEpisodeIdFromCharacter as jest.Mock;
  const mockedMatch = helperModule.matchEpisodes as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return nulls when no characters are provided', () => {
    (useGetEpisodesModule.useGetEpisodes as jest.Mock).mockReturnValue({
        episodes: null,
        loading: false,
        error: null,
      });
      
    const { result } = renderHook(() => useEpisodeData(null, null));

    expect(result.current.bothCharactersSelected).toBe(false);
    expect(result.current.firstCharacterEpisodes).toBeNull();
    expect(result.current.secondCharacterEpisodes).toBeNull();
    expect(result.current.matchedCharacterEpisodes).toBeNull();
  });

  it('should return episode data when both characters are selected', () => {
    mockedExtract
      .mockImplementationOnce(() => ['1', '2'])
      .mockImplementationOnce(() => ['1']);     

    mockedMatch.mockReturnValue(['1']);

    mockedUseGetEpisodes
      .mockReturnValueOnce({ episodes: [mockEpisodes[0], mockEpisodes[1]], loading: false, error: null }) 
      .mockReturnValueOnce({ episodes: [mockEpisodes[0]], loading: false, error: null })                  
      .mockReturnValueOnce({ episodes: [mockEpisodes[0]], loading: false, error: null });                

    const { result } = renderHook(() => useEpisodeData(mockCharacter1, mockCharacter2));

    expect(result.current.bothCharactersSelected).toBe(true);
    expect(result.current.firstCharacterEpisodes).toEqual([mockEpisodes[0], mockEpisodes[1]]);
    expect(result.current.secondCharacterEpisodes).toEqual([mockEpisodes[0]]);
    expect(result.current.matchedCharacterEpisodes).toEqual([mockEpisodes[0]]);
  });

  it('should return null for matchedCharacterEpisodes if no matched ids', () => {
    mockedExtract
      .mockImplementationOnce(() => ['1', '2'])
      .mockImplementationOnce(() => ['3']);

    mockedMatch.mockReturnValue([]);

    mockedUseGetEpisodes
      .mockReturnValue({ episodes: mockEpisodes, loading: false, error: null });

    const { result } = renderHook(() => useEpisodeData(mockCharacter1, mockCharacter2));

    expect(result.current.bothCharactersSelected).toBe(true);
    expect(result.current.matchedCharacterEpisodes).toBeNull();
  });
});
