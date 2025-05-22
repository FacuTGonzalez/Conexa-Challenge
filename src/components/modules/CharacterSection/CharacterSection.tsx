'use client'
import { useGetCharacters } from '@/services/charactersService/hooks/useGetCharacters';
import React, { useState } from 'react';
import styles from './CharacterSection.module.scss';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CharacterCard } from '../CharacterCard/CharacterCard';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import useCharacterStore from '@/store/characterStore';
import { Character, CharacterStatus } from '@/models/characters.model';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';


type SectionProps = {
    title: string
    isFirstSection?: boolean;
}

export const CharacterSection = ({ title, isFirstSection }: SectionProps) => {
    const { characters, page, loading, totalRecords, setPage, setName, setStatus, status } = useGetCharacters({ page: 1 });
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
            if (firstCharacter?.id !== character.id) {
                setFirstCharacter(character);
            }
        } else {
            if (secondCharacter?.id !== character.id) {
                setSecondCharacter(character);
            }
        }
    };

    const options = [
        { label: 'All', value: null },
        { label: CharacterStatus.Alive, value: CharacterStatus.Alive },
        { label: CharacterStatus.Dead, value: CharacterStatus.Dead },
        { label: CharacterStatus.Unknown, value: CharacterStatus.Unknown },
    ]

    return (
        <div className={styles.container}>
            <div>
                <p className='font-bold text-xl my-2 mx-4'>{title}</p>
            </div>
            <div className='flex ml-4 my-2'>
                <InputText className='h-2rem' placeholder='Search' onChange={(e) => setName(e.target.value)} />
                <div className='pb-2 pl-2'>
                    <Dropdown className='h-2rem w-12rem flex' options={options}  onChange={(e) => setStatus(e.target.value)} value={status} />
                </div>
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