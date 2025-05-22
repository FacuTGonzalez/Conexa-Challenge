'use client';
import React from 'react'
import styles from './MainLayout.module.scss';
import { CharacterSection } from '@/components/modules/CharacterSection/CharacterSection';
import EpisodeSection from '@/components/modules/EpisodeSection/EpisodeSection';

export const MainLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sections}>
        <CharacterSection title='Character #1' isFirstSection />
        <CharacterSection title='Character #2' />
      </div>
      <EpisodeSection />
    </div>
  )
}
