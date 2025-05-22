import { useEffect, useState } from 'react';
import axios from 'axios';
import { Character, CharacterStatus } from '@/models/characters.model';
import { RequestParams } from '@/models/filters.model';
import { charactersServices } from '../charactersServices';

type UseCharactersResponse = {
  characters: Character[] | null;
  loading: boolean;
  error: string | null;
  pages: number | undefined;
  page: number;
  totalRecords: number | undefined;
  status?: CharacterStatus;
  setPage(page: number): void;
  setName(name: string): void;
  setStatus(status: CharacterStatus): void;
};

export const useGetCharacters = ({
  page: initialPage = 1,
  name: initialName = '',
  status: initialStatus
}: RequestParams): UseCharactersResponse => {
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [totalRecords, setTotalRecords] = useState<number | undefined>(undefined)
  const [pages, setPages] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [name, setName] = useState<string>(initialName);
  const [status, setStatus] = useState<CharacterStatus>();

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await charactersServices.getAll({ page, status, name });
        setCharacters(response.data.results);
        setPages(response.data.info.pages);
        setTotalRecords(response.data.info.count)
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Error fetching characters');
        setCharacters(null);
        setTotalRecords(undefined)
        setPages(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [page, name, status]);

  return { characters, loading, error, pages, page, setPage, totalRecords, setName, setStatus, status };
};
