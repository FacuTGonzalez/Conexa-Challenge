import { Character, CharacterStatus } from '@/models/characters.model';
import React from 'react';
import styles from './CharacterCard.module.scss';
import Image from 'next/image';
import { BiPlusMedical } from "react-icons/bi";
import { FaSkullCrossbones } from "react-icons/fa";
import { TbDeviceUnknownFilled } from "react-icons/tb";
import { GiRobotGolem } from "react-icons/gi";
import { RiAliensFill } from "react-icons/ri";
import { MdOutlineEmojiPeople } from "react-icons/md";
import useCharacterStore from '@/store/characterStore';


type CharacterCardProps = {
    character: Character;
    onClick(character: Character) : void;
    isActive: boolean;
}

export const CharacterCard = ({ character, onClick, isActive }: CharacterCardProps) => {

    const getStatusIcon  = () => {
        switch (character.status) {
            case CharacterStatus.Alive:
                return <BiPlusMedical color='#76db9b' />
            case CharacterStatus.Dead:
                return <FaSkullCrossbones color='#ff6259' />
            default:
                return <TbDeviceUnknownFilled />
        }
    };

    const getSpeciesIcon = () => {
        switch (character.species.toLowerCase()) {
            case 'human':
                return <MdOutlineEmojiPeople title="Human" />;
            case 'alien':
                return <RiAliensFill title="Alien" />;
            case 'robot':
                return <GiRobotGolem title="Robot" />;
            default:
                return <TbDeviceUnknownFilled title={character.species} />;
        }
    };

    const InfoRow = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
        <div className="flex gap-2 align-items-center mt-2">
          {icon}
          <p>{label}</p>
        </div>
      );

    return (
        <div className={`${styles.container} ${isActive ? styles.active : ''}`} onClick={() => onClick(character)}>
            <div className={styles.imageContainer}>
                <Image src={character.image} layout='fill' alt='character image' objectFit='cover' quality={100}/>
            </div>
            <div className={styles.info}>
                <p className={styles.name}>{character.name}</p>
                <div>
                    <div className={styles.additionalInfo}>
                    <InfoRow icon={getStatusIcon()} label={character.status} />
                    <InfoRow icon={getSpeciesIcon()} label={character.species} />
                    </div>
                </div>
            </div>
        </div>
    );
};
