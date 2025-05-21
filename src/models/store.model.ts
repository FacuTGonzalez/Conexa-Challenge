import { Character } from "./characters.model";

export type CharacterStore = {
    firstCharacter: Character | null;
    secondCharacter: Character | null;
    setFirstCharacter: (character: Character) => void;
    setSecondCharacter: (character: Character) => void;
}