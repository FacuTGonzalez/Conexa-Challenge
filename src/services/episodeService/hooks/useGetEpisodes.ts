import { useEffect, useState } from 'react';
import axios from 'axios';
import { RequestParams } from '@/models/filters.model';
import { episodesServices } from '../episodesServices';
import { Episode } from '@/models/episodes.model';

type UseEpisodesResponse = {
    episodes: Episode[] | null;
    loading: boolean;
    error: string | null;
    pages: number | undefined;
    page: number;
    totalRecords: number | undefined;
    setPage: (page: number) => void;
};

export const useGetEpisodes = ({
    id, params
}: { id: string[], params: RequestParams }): UseEpisodesResponse => {
    const [episodes, setEpisodes] = useState<Episode[] | null>(null);
    const [totalRecords, setTotalRecords] = useState<number | undefined>(undefined)
    const [pages, setPages] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        const fetchEpisodes = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await episodesServices.getAll({ id, params });
                setEpisodes(response.data.results);
                setPages(response.data.info.pages);
                setTotalRecords(response.data.info.count)
            } catch (err: any) {
                setError(err?.response?.data?.error || 'Error fetching episodes');
                setEpisodes(null);
                setTotalRecords(undefined)
                setPages(undefined);
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodes();
    }, [page, id]);

    return { episodes, loading, error, pages, page, setPage, totalRecords };
};
