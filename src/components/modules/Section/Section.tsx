'use client'
import { useGetCharacters } from '@/services/charactersService/hooks/useGetCharacters';
import React from 'react';
import styles from './Section.module.scss';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CharacterCard } from '../CharacterCard/CharacterCard';


type SectionProps = {
}

export const Section = ({ }: SectionProps) => {
    const { characters, page, pages, loading } = useGetCharacters({ page: 1 });

    return (
        <div className={styles.container}>
            {loading && <div className='flex w-full justify-content-center'>
                <ProgressSpinner  />
            </div>}
            <div className={styles.cards}>
            {!loading && characters && characters.map((c,i) => <CharacterCard key={i} character={c}/>)}
            </div>
        </div>
    )
}
