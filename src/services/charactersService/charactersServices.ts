import axios from "axios"
import { charactersRoutes } from "./charactersRoutes"
import { RequestParams } from "@/models/filters.model"
import { parseParams } from "@/utils/parseParams";

export const charactersServices = {
    getAll: (params:RequestParams) => {
        const stringParams = parseParams(params)

        return axios.get(charactersRoutes.getAll(stringParams));
    }
}