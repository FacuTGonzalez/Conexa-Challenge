import { useEffect, useState } from 'react';
import axios from 'axios';
import { Character } from '@/models/characters';
import { RequestParams } from '@/models/filters';
import { characterServices } from '../charactersServices';

type UseCharactersResponse = {
  characters: Character[] | null;
  loading: boolean;
  error: string | null;
  pages: number | null;
  page: number;
  setPage: (page: number) => void;
};

export const useGetCharacters = ({
  page: initialPage = 1,
  name,
  status
}: RequestParams): UseCharactersResponse => {
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [pages, setPages] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await characterServices.getAll({ page, status, name });
        setCharacters(response.data.results);
        setPages(response.data.info.pages);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Error fetching characters');
        setCharacters(null);
        setPages(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [page, name, status]);

  return { characters, loading, error, pages, page, setPage };
};
