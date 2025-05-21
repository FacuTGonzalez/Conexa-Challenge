import { RequestParams } from "@/models/filters";
import next from "next";
import { env } from "process";

const BASE_URL = `${process.env.NEXT_PUBLIC_API}/character`;

export const characterRoutes = {
    getAll : ( params?: string) => `${BASE_URL}/?${params}`
}