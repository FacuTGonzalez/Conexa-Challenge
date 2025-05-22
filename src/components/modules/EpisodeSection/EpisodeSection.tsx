'use client';
import React from 'react'
import styles from './EpisodeSection.module.scss';
import useEpisodeData from '@/services/episodesServices/hooks/useEpisodeData/useEpisodeData';
import useCharacterStore from '@/store/characterStore';


const EpisodeSection = () => {
    const { firstCharacter, secondCharacter } = useCharacterStore();
    const { firstCharacterEpisodes, secondCharacterEpisodes, matchedCharacterEpisodes, bothCharactersSelected } = useEpisodeData(firstCharacter, secondCharacter);
    return (
        <div className={styles.container}>
            <div className={styles.episodes}>
                <p className='font-bold text-xl ml-3 border-bottom-1 border-bottom-solid'>Character #1 ({firstCharacter?.name}) - Only Episodes</p>
                <div className={styles.episodesList}>
                    {!bothCharactersSelected && <p>{'Please select characters'}</p>}
                    <ul>
                        {bothCharactersSelected && firstCharacterEpisodes && firstCharacterEpisodes?.map((e, i) => <li key={i}>{e.episode}-{e.name}-{e.air_date}</li>)}
                    </ul>
                </div>
            </div>
            <div className={styles.episodes}>
                <p className='font-bold text-xl pl-3 border-bottom-1 border-bottom-solid'>Character #1 & #2 - Shared Episodes</p>
                <div className={styles.episodesList}>
                    {!bothCharactersSelected && <p>{'Please select characters'}</p>}
                    {!matchedCharacterEpisodes && bothCharactersSelected && <p>{'No shared episodes'}</p>}
                    <ul>
                        {bothCharactersSelected && matchedCharacterEpisodes && matchedCharacterEpisodes?.map((e, i) => <li key={i}>{e.episode}-{e.name}-{e.air_date}</li>)}
                    </ul>
                </div>
            </div>
            <div className={styles.episodes}>
                <p className='font-bold text-xl pl-3 border-bottom-1 border-bottom-solid'>Character #2 ({secondCharacter?.name}) - Only Episodes</p>
                <div className={styles.episodesList}>
                    {!bothCharactersSelected && <p>{'Please select characters'}</p>}
                    <ul>
                        {bothCharactersSelected && secondCharacterEpisodes && secondCharacterEpisodes?.map((e, i) => <li key={i}>{e.episode}-{e.name}-{e.air_date}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default EpisodeSection
