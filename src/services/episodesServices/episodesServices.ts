import axios from "axios"
import { episodesRoutes } from "./episodesRoutes";

export const episodesServices = {
    getAll: ({ id }: { id:string[] }) => {
        const joinedId = id.join(',');
        return axios.get(episodesRoutes.getAll({ id: joinedId}));
    }
}