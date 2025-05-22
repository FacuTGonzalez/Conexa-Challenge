// __tests__/useGetCharacters.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { charactersServices } from '@/services/charactersServices/charactersServices';
import { CharacterStatus } from '@/models/characters.model';
import { useGetCharacters } from './useGetCharacters';

jest.mock('@/services/charactersServices/charactersServices');

const mockedGetAll = charactersServices.getAll as jest.Mock;

describe('useGetCharacters', () => {
  const mockResponse = {
    data: {
      results: [
        { id: 1, name: 'Rick Sanchez' },
        { id: 2, name: 'Morty Smith' }
      ],
      info: {
        pages: 10,
        count: 100
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch characters and update state correctly', async () => {
    mockedGetAll.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() =>
      useGetCharacters({ page: 1, name: '', status: undefined })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedGetAll).toHaveBeenCalledWith({ page: 1, name: '', status: undefined });
    expect(result.current.characters).toEqual(mockResponse.data.results);
    expect(result.current.pages).toBe(10);
    expect(result.current.totalRecords).toBe(100);
    expect(result.current.error).toBeNull();
  });

  it('should handle error on fetch failure', async () => {
    mockedGetAll.mockRejectedValueOnce({
      response: { data: { error: 'Something went wrong' } }
    });

    const { result } = renderHook(() =>
      useGetCharacters({ page: 1, name: '', status: undefined })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Something went wrong');
    expect(result.current.characters).toBeNull();
    expect(result.current.pages).toBeUndefined();
    expect(result.current.totalRecords).toBeUndefined();
  });

  it('should update page and refetch data', async () => {
    mockedGetAll.mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useGetCharacters({ page: 1, name: '', status: undefined })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(mockedGetAll).toHaveBeenLastCalledWith({ page: 2, name: '', status: undefined });
      expect(result.current.page).toBe(2);
    });
  });

  it('should update name and status and refetch data', async () => {
    mockedGetAll.mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useGetCharacters({ page: 1, name: '', status: undefined })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setName('Rick');
      result.current.setStatus(CharacterStatus.Alive);
    });

    await waitFor(() =>
      expect(mockedGetAll).toHaveBeenLastCalledWith({
        page: 1,
        name: 'Rick',
        status: CharacterStatus.Alive
      })
    );
  });
});
