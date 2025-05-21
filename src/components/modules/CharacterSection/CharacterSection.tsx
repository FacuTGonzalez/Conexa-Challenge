'use client'
import { useGetCharacters } from '@/services/charactersService/hooks/useGetCharacters';
import React, { useState } from 'react';
import styles from './CharacterSection.module.scss';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CharacterCard } from '../CharacterCard/CharacterCard';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import useCharacterStore from '@/store/characterStore';
import { Character } from '@/models/characters.model';


type SectionProps = {
    title: string
    titlePosition: 'right' | 'left';
    isFirstSection?: boolean;
}

export const CharacterSection = ({ title, titlePosition, isFirstSection }: SectionProps) => {
    const { characters, page, loading, totalRecords, setPage } = useGetCharacters({ page: 1 });
    const { firstCharacter, secondCharacter, setFirstCharacter, setSecondCharacter } = useCharacterStore();
    const [rows, setRows] = useState(10);

    const onPageChange = (event: PaginatorPageChangeEvent): void => {
        setPage(event.page + 1);
        setRows(event.rows);
    };

    const renderSkeletons = () =>
        Array.from({ length: 9 }).map((_, i) => (
            <div
                key={i}
                className="w-16rem h-6rem border-round-lg m-2"
            >
                <Skeleton width="100%" height="100%" />
            </div>
        ));

    const onCharacterClick = (character: Character) => {
        if (isFirstSection) {
            setFirstCharacter(character);
        } else {
            setSecondCharacter(character);
        }
    };
    
    return (
        <div className={styles.container}>
            <div className={`${titlePosition === 'left' ? 'flex flex-start' : 'flex justify-content-end'}`}>
                <p className='font-bold text-xl my-2 mx-4'>{title}</p>
            </div>
            <div className={styles.cards}>
                {loading ? renderSkeletons() : characters && characters.map((c, i) => <CharacterCard isActive={isFirstSection ? c.id === firstCharacter?.id : c.id === secondCharacter?.id} onClick={onCharacterClick} key={i} character={c} />)}
            </div>
            <div className={styles.paginatorWrapper}>
                <Paginator
                    first={(page - 1) * rows}
                    rows={rows}
                    totalRecords={totalRecords || 0}
                    onPageChange={onPageChange}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate={`{totalRecords} resultados`}
                />
            </div>
        </div>
    )
}