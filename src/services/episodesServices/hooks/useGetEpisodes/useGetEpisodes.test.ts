import { renderHook, waitFor } from '@testing-library/react';
import { useGetEpisodes } from './useGetEpisodes';
import { Episode } from '@/models/episodes.model';
import { episodesServices } from '../../episodesServices';

jest.mock('@/services/episodesServices/episodesServices', () => ({
  episodesServices: {
    getAll: jest.fn(),
  },
}));

describe('useGetEpisodes', () => {
  const mockEpisodes: Episode[] = [
    {
      id: 1,
      name: 'Episode 1',
      episode: 'S01E01',
      air_date: '2020-01-01',
      characters: [],
      url: 'https://example.com/episode/1',
      created: '2020-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      name: 'Episode 2',
      episode: 'S01E02',
      air_date: '2020-01-08',
      characters: [],
      url: 'https://example.com/episode/2',
      created: '2020-01-08T00:00:00.000Z',
    },
  ];

  it('should fetch episodes and return them', async () => {
    (episodesServices.getAll as jest.Mock).mockResolvedValue({
      data: mockEpisodes,
    });

    const { result } = renderHook(() =>
      useGetEpisodes({ id: ['2', '1'] })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(episodesServices.getAll).toHaveBeenCalledWith({
      id: ['1', '2'], // Ordenado
    });
    expect(result.current.episodes).toEqual(mockEpisodes);
    expect(result.current.error).toBeNull();
  });

  it('should handle error response', async () => {
    (episodesServices.getAll as jest.Mock).mockRejectedValue({
      response: { data: { error: 'Not found' } },
    });

    const { result } = renderHook(() =>
      useGetEpisodes({ id: ['1'] })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.episodes).toBeNull();
    expect(result.current.error).toBe('Not found');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return early and not call API if no id is provided', async () => {
    const spy = jest.spyOn(episodesServices, 'getAll');

    const { result } = renderHook(() =>
      useGetEpisodes({ id: [] })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(spy).not.toHaveBeenCalled();
    expect(result.current.episodes).toBeNull();
  });
});
