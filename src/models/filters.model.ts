import { CharacterStatus } from "./characters.model";

export interface RequestParams {
    page: number;
    name?: string;
    status?: CharacterStatus;
};

