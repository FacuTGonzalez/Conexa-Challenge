import { Character } from '@/models/characters.model';
import { CharacterStore } from '@/models/store.model';
import { create } from 'zustand';

const useCharacterStore = create<CharacterStore>((set) => ({
    firstCharacter: null,
    secondCharacter: null,
    setFirstCharacter: (character: Character) => set({ firstCharacter: character }),
    setSecondCharacter: (character: Character) => set({ secondCharacter: character }),
}));

export default useCharacterStore;
