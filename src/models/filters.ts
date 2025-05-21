import { CharacterStatus } from "./characters";

export interface RequestParams {
    page: number;
    name?: string;
    status?: CharacterStatus;
};

