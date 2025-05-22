import { RequestParams } from "@/models/filters.model";

export const parseParams = (params: RequestParams) : string => {
    const searchParams = new URLSearchParams();
    searchParams.append('page', String(params.page));
    if (params.name) searchParams.append('name', params.name);
    if (params.status && typeof params.status === 'string') searchParams.append('status', params.status);

    return searchParams.toString()
};