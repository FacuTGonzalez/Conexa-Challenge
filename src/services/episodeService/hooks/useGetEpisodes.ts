import { useEffect, useMemo, useState } from 'react';
import { RequestParams } from '@/models/filters.model';
import { episodesServices } from '../episodesServices';
import { Episode } from '@/models/episodes.model';

type UseEpisodesResponse = {
    episodes: Episode[] | null;
    loading: boolean;
    error: string | null;
}

export const useGetEpisodes = ({
    id,
    params
}: {
    id: string[];
    params: RequestParams;
}): UseEpisodesResponse => {
    const [episodes, setEpisodes] = useState<Episode[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const stableId = useMemo(() => id.sort().join(','), [id]);
    const stableParams = useMemo(() => JSON.stringify(params), [params]);
    useEffect(() => {
        const fetchEpisodes = async () => {
            setLoading(true);
            setError(null);

            try {
                const parsedIds = stableId.split(',').filter(Boolean);
                if (parsedIds.length === 0) return;
                const response = await episodesServices.getAll({ id: parsedIds });
                setEpisodes(Array.isArray(response.data)? response.data : [response.data]);
            } catch (err: any) {
                setError(err?.response?.data?.error || 'Error fetching episodes');
                setEpisodes(null);

            } finally {
                setLoading(false);
            }
        };

        fetchEpisodes();
    }, [stableId, stableParams]);

    return { episodes, loading, error };
};
