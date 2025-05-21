import axios from "axios"
import { RequestParams } from "@/models/filters.model"
import { parseParams } from "@/utils/parseParams";
import { episodesRoutes } from "./episodesRoutes";

export const episodesServices = {
    getAll: ({ id, params }: { id:string[], params: RequestParams }) => {
        const stringParams = parseParams(params);
        const joinedId = id.join(',');
        return axios.get(episodesRoutes.getAll({params: stringParams, id: joinedId}));
    }
}