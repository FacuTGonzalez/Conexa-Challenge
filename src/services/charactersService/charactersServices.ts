import axios from "axios"
import { characterRoutes } from "./characterRoutes"
import { RequestParams } from "@/models/filters"
import { parseParams } from "@/utils/parseParams";

export const characterServices = {
    getAll: (params:RequestParams) => {
        const stringParams = parseParams(params)

        return axios.get(characterRoutes.getAll(stringParams));
    }
}