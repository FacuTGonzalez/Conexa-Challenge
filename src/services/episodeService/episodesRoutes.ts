import { RequestParams } from "@/models/filters.model";
import next from "next";
import { env } from "process";

const BASE_URL = `${process.env.NEXT_PUBLIC_API}/episode`;

export const episodesRoutes = {
    getAll: ({ id, params }: { id: string, params?: string }) => `${BASE_URL}/${id}/?${params}`
}