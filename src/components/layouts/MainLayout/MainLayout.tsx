'use client'
import { Section } from '@/components/modules/Section/Section'
import React from 'react'
import styles from './MainLayout.module.scss';

export const MainLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sections}>
      <Section />
      <Section />
      </div>
    </div>
  )
}
