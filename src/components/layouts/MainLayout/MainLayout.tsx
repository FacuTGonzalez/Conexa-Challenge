'use client'
import React from 'react'
import styles from './MainLayout.module.scss';
import useCharacterStore from '@/store/characterStore';
import { CharacterSection } from '@/components/modules/CharacterSection/CharacterSection';
import { EpisodeSection } from '@/components/modules/EpisodeSection/EpisodeSection';

export const MainLayout = () => {
  const { firstCharacter, secondCharacter, setFirstCharacter, setSecondCharacter } = useCharacterStore();
  return (
    <div className={styles.container}>
      <div className={styles.sections}>
      <CharacterSection title='Character #1' titlePosition='left' isFirstSection/>
      <CharacterSection  title='Character #2' titlePosition='right'/>
      </div>
       <EpisodeSection/>
    </div>
  )
}
