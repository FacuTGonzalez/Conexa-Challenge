import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CharacterCard } from './CharacterCard'
import { Character, CharacterGender, CharacterStatus } from '@/models/characters.model'

// Mock de next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, objectFit, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      style={{ objectFit: objectFit || 'cover' }}
      {...props}
    />
  ),
}))

// Mock de react-icons
jest.mock('react-icons/bi', () => ({
  BiPlusMedical: ({ color }: { color?: string }) => (
    <span data-testid="alive-icon" style={{ color }}>
      ⚕️
    </span>
  ),
}))

jest.mock('react-icons/fa', () => ({
  FaSkullCrossbones: ({ color }: { color?: string }) => (
    <span data-testid="dead-icon" style={{ color }}>
      💀
    </span>
  ),
}))

jest.mock('react-icons/tb', () => ({
  TbDeviceUnknownFilled: ({ title }: { title?: string }) => (
    <span data-testid="unknown-icon" title={title}>
      ❓
    </span>
  ),
}))

jest.mock('react-icons/gi', () => ({
  GiRobotGolem: ({ title }: { title?: string }) => (
    <span data-testid="robot-icon" title={title}>
      🤖
    </span>
  ),
}))

jest.mock('react-icons/ri', () => ({
  RiAliensFill: ({ title }: { title?: string }) => (
    <span data-testid="alien-icon" title={title}>
      👽
    </span>
  ),
}))

jest.mock('react-icons/md', () => ({
  MdOutlineEmojiPeople: ({ title }: { title?: string }) => (
    <span data-testid="human-icon" title={title}>
      👤
    </span>
  ),
}))

// Mock de estilos SCSS
jest.mock('./CharacterCard.module.scss', () => ({
  container: 'container',
  active: 'active',
  imageContainer: 'imageContainer',
  info: 'info',
  name: 'name',
  additionalInfo: 'additionalInfo',
}))

describe('CharacterCard', () => {
  const mockOnClick = jest.fn()

  const mockCharacterAlive: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: CharacterStatus.Alive,
    species: 'Human',
    image: 'https://example.com/rick.jpg',
    type: '',
    gender: CharacterGender.Male,
    origin: {
      name: 'Earth (C-137)',
      url: 'https://rickandmortyapi.com/api/location/1'
    },
    location: {
      name: 'Citadel of Ricks',
      url: 'https://rickandmortyapi.com/api/location/3'
    },
    episode: ['https://rickandmortyapi.com/api/episode/1'],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z'
  }

  const mockCharacterDead: Character = {
    ...mockCharacterAlive,
    id: 2,
    name: 'Birdperson',
    status: CharacterStatus.Dead,
    species: 'Alien'
  }

  const mockCharacterUnknown: Character = {
    ...mockCharacterAlive,
    id: 3,
    name: 'Mystery Character',
    status: 'unknown' as CharacterStatus,
    species: 'Robot'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders character information correctly', () => {
    render(
      <CharacterCard
        character={mockCharacterAlive}
        onClick={mockOnClick}
        isActive={false}
      />
    )

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Alive')).toBeInTheDocument()
    expect(screen.getByText('Human')).toBeInTheDocument()
    expect(screen.getByAltText('character image')).toBeInTheDocument()
    expect(screen.getByAltText('character image')).toHaveAttribute(
      'src',
      'https://example.com/rick.jpg'
    )
  })

  it('applies active class when isActive is true', () => {
    const { container } = render(
      <CharacterCard
        character={mockCharacterAlive}
        onClick={mockOnClick}
        isActive={true}
      />
    )

    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass('container active')
  })

  it('does not apply active class when isActive is false', () => {
    const { container } = render(
      <CharacterCard
        character={mockCharacterAlive}
        onClick={mockOnClick}
        isActive={false}
      />
    )

    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass('container')
    expect(cardElement).not.toHaveClass('active')
  })

  it('calls onClick with character when clicked', () => {
    render(
      <CharacterCard
        character={mockCharacterAlive}
        onClick={mockOnClick}
        isActive={false}
      />
    )

    const cardElement = screen.getByText('Rick Sanchez').closest('div')
    fireEvent.click(cardElement!)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
    expect(mockOnClick).toHaveBeenCalledWith(mockCharacterAlive)
  })

  describe('Status Icons', () => {
    it('displays correct icon for alive status', () => {
      render(
        <CharacterCard
          character={mockCharacterAlive}
          onClick={mockOnClick}
          isActive={false}
        />
      )

      const aliveIcon = screen.getByTestId('alive-icon')
      expect(aliveIcon).toBeInTheDocument()
      expect(aliveIcon).toHaveStyle({ color: '#76db9b' })
    })

    it('displays correct icon for dead status', () => {
      render(
        <CharacterCard
          character={mockCharacterDead}
          onClick={mockOnClick}
          isActive={false}
        />
      )

      const deadIcon = screen.getByTestId('dead-icon')
      expect(deadIcon).toBeInTheDocument()
      expect(deadIcon).toHaveStyle({ color: '#ff6259' })
    })

    it('displays unknown icon for unknown status', () => {
      render(
        <CharacterCard
          character={mockCharacterUnknown}
          onClick={mockOnClick}
          isActive={false}
        />
      )

      expect(screen.getByTestId('unknown-icon')).toBeInTheDocument()
    })
  })

  describe('Species Icons', () => {
    it('displays human icon for human species', () => {
      render(
        <CharacterCard
          character={mockCharacterAlive}
          onClick={mockOnClick}
          isActive={false}
        />
      )

      const humanIcon = screen.getByTestId('human-icon')
      expect(humanIcon).toBeInTheDocument()
      expect(humanIcon).toHaveAttribute('title', 'Human')
    })

    it('displays alien icon for alien species', () => {
      render(
        <CharacterCard
          character={mockCharacterDead}
          onClick={mockOnClick}
          isActive={false}
        />
      )

      const alienIcon = screen.getByTestId('alien-icon')
      expect(alienIcon).toBeInTheDocument()
      expect(alienIcon).toHaveAttribute('title', 'Alien')
    })

    it('displays robot icon for robot species', () => {
      render(
        <CharacterCard
          character={mockCharacterUnknown}
          onClick={mockOnClick}
          isActive={false}
        />
      )

      const robotIcon = screen.getByTestId('robot-icon')
      expect(robotIcon).toBeInTheDocument()
      expect(robotIcon).toHaveAttribute('title', 'Robot')
    })

    it('displays unknown icon for unknown species', () => {
      const unknownSpeciesCharacter = {
        ...mockCharacterAlive,
        species: 'Mythical Creature'
      }

      render(
        <CharacterCard
          character={unknownSpeciesCharacter}
          onClick={mockOnClick}
          isActive={false}
        />
      )

      const unknownIcon = screen.getByTestId('unknown-icon')
      expect(unknownIcon).toBeInTheDocument()
      expect(unknownIcon).toHaveAttribute('title', 'Mythical Creature')
    })

    it('handles case insensitive species matching', () => {
      const uppercaseSpeciesCharacter = {
        ...mockCharacterAlive,
        species: 'HUMAN'
      }

      render(
        <CharacterCard
          character={uppercaseSpeciesCharacter}
          onClick={mockOnClick}
          isActive={false}
        />
      )

      expect(screen.getByTestId('human-icon')).toBeInTheDocument()
    })
  })

  describe('InfoRow Component', () => {
    it('renders InfoRow with icon and label correctly', () => {
      render(
        <CharacterCard
          character={mockCharacterAlive}
          onClick={mockOnClick}
          isActive={false}
        />
      )

      expect(screen.getByTestId('alive-icon')).toBeInTheDocument()
      expect(screen.getByText('Alive')).toBeInTheDocument()
      
      expect(screen.getByTestId('human-icon')).toBeInTheDocument()
      expect(screen.getByText('Human')).toBeInTheDocument()
    })
  })
})