import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CharacterSection } from './CharacterSection'
import { Character, CharacterGender, CharacterStatus } from '@/models/characters.model'
import userEvent from '@testing-library/user-event'
import { SkeletonProps } from 'primereact/skeleton'
import { InputTextProps } from 'primereact/inputtext'
import { PaginatorProps } from 'primereact/paginator'

// Mock del hook personalizado useGetCharacters
const mockUseGetCharacters = {
  characters: [] as Character[],
  page: 1,
  loading: false,
  totalRecords: 0 as number | null,
  setPage: jest.fn(),
  setName: jest.fn(),
  setStatus: jest.fn(),
  status: null as CharacterStatus | null,
}

jest.mock('@/services/charactersServices/hooks/useGetCharacters/useGetCharacters', () => ({
  useGetCharacters: jest.fn(() => mockUseGetCharacters),
}))

// Mock del store de caracteres
const mockCharacterStore = {
  firstCharacter: null as Character | null,
  secondCharacter: null as Character | null,
  setFirstCharacter: jest.fn(),
  setSecondCharacter: jest.fn(),
}

jest.mock('@/store/characterStore', () => ({
  __esModule: true,
  default: jest.fn(() => mockCharacterStore),
}))


// Mock del componente CharacterCard
jest.mock('../CharacterCard/CharacterCard', () => ({
  CharacterCard: ({ character, onClick, isActive }: {
    character: Character;
    onClick(character: Character): void;
    isActive: boolean;
  }) => (
    <div
      data-testid={`character-card-${character.id}`}
      onClick={() => onClick(character)}
      className={isActive ? 'active' : ''}
    >
      {character.name}
    </div>
  ),
}))

jest.mock('primereact/paginator', () => ({
  Paginator: ({ onPageChange, first, rows, totalRecords }: PaginatorProps) => (
    <div data-testid="paginator">
      <button
        data-testid="next-page"
        onClick={() => onPageChange ? onPageChange({ page: 1, rows: 10, pageCount:10, first:1 }) : null}
      >
        Next
      </button>
      <span data-testid="pagination-info">
        {first} - {rows} of {totalRecords}
      </span>
    </div>
  ),
}))

jest.mock('primereact/skeleton', () => ({
  Skeleton: ({ width, height }: SkeletonProps) => (
    <div data-testid="skeleton" style={{ width, height }}>
      Skeleton
    </div>
  ),
}))

jest.mock('primereact/inputtext', () => ({
  InputText: ({ placeholder, onChange, className }: InputTextProps) => (
    <input
      data-testid="search-input"
      placeholder={placeholder}
      onChange={onChange}
      className={className}
    />
  ),
}))

jest.mock('primereact/dropdown', () => ({
  //@ts-ignore
  Dropdown: ({ options, onChange, value, className }: unknown) => (
    <select
      data-testid="status-dropdown"
      onChange={(e) => onChange({ target: { value: e.target.value || null } })}
      value={value || ''}
      className={className}
    >
      {options.map((option: { label: string, value: string }, index: number) => (
        <option key={index} value={option.value || ''}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}))

// Mock de estilos SCSS
jest.mock('./CharacterSection.module.scss', () => ({
  container: 'container',
  cards: 'cards',
  paginatorWrapper: 'paginatorWrapper',
}))

describe('CharacterSection', () => {
  const mockCharacters: Character[] = [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: CharacterStatus.Alive,
      species: 'Human',
      image: 'https://example.com/rick.jpg',
      type: '',
      gender: CharacterGender.Male,
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Citadel of Ricks', url: '' },
      episode: [],
      url: '',
      created: '',
    },
    {
      id: 2,
      name: 'Morty Smith',
      status: CharacterStatus.Alive,
      species: 'Human',
      image: 'https://example.com/morty.jpg',
      type: '',
      gender: CharacterGender.Male,
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Earth (Replacement Dimension)', url: '' },
      episode: [],
      url: '',
      created: '',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset mock values
    mockUseGetCharacters.characters = [] as Character[]
    mockUseGetCharacters.loading = false
    mockUseGetCharacters.page = 1
    mockUseGetCharacters.totalRecords = 0
    mockUseGetCharacters.status = null
    mockCharacterStore.firstCharacter = null
    mockCharacterStore.secondCharacter = null
  })

  it('renders title correctly', () => {
    render(<CharacterSection title="Test Section" />)
    expect(screen.getByText('Test Section')).toBeInTheDocument()
  })

  it('renders search input and status dropdown', () => {
    render(<CharacterSection title="Test Section" />)

    expect(screen.getByTestId('search-input')).toBeInTheDocument()
    expect(screen.getByTestId('status-dropdown')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
  })

  it('renders status dropdown with correct options', () => {
    render(<CharacterSection title="Test Section" />)

    const dropdown = screen.getByTestId('status-dropdown')
    expect(dropdown).toBeInTheDocument()

    // Check that all options are present
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Alive')).toBeInTheDocument()
    expect(screen.getByText('Dead')).toBeInTheDocument()
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })

  it('shows skeletons when loading', () => {
    mockUseGetCharacters.loading = true

    render(<CharacterSection title="Test Section" />)

    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(9)
  })

  it('renders character cards when not loading', () => {
    mockUseGetCharacters.characters = mockCharacters
    mockUseGetCharacters.loading = false

    render(<CharacterSection title="Test Section" />)

    expect(screen.getByTestId('character-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('character-card-2')).toBeInTheDocument()
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Morty Smith')).toBeInTheDocument()
  })

  it('renders paginator', () => {
    mockUseGetCharacters.totalRecords = 20

    render(<CharacterSection title="Test Section" />)

    expect(screen.getByTestId('paginator')).toBeInTheDocument()
  })

  it('calls setName when search input changes', async () => {
    const user = userEvent.setup()
    render(<CharacterSection title="Test Section" />)

    const searchInput = screen.getByTestId('search-input')
    await user.type(searchInput, 'Rick')

    expect(mockUseGetCharacters.setName).toHaveBeenCalledWith('Rick')
  })

  it('calls setStatus when dropdown changes', async () => {
    const user = userEvent.setup()
    render(<CharacterSection title="Test Section" />)

    const dropdown = screen.getByTestId('status-dropdown')
    await user.selectOptions(dropdown, CharacterStatus.Alive)

    expect(mockUseGetCharacters.setStatus).toHaveBeenCalledWith(CharacterStatus.Alive)
  })

  it('calls setPage when paginator changes', () => {
    render(<CharacterSection title="Test Section" />)

    const nextButton = screen.getByTestId('next-page')
    fireEvent.click(nextButton)

    expect(mockUseGetCharacters.setPage).toHaveBeenCalledWith(2)
  })

  describe('Character selection - First Section', () => {
    it('sets first character when clicking on character card in first section', () => {
      mockUseGetCharacters.characters = mockCharacters

      render(<CharacterSection title="First Section" isFirstSection={true} />)

      const characterCard = screen.getByTestId('character-card-1')
      fireEvent.click(characterCard)

      expect(mockCharacterStore.setFirstCharacter).toHaveBeenCalledWith(mockCharacters[0])
    })

    it('does not set first character if same character is already selected', () => {
      mockUseGetCharacters.characters = mockCharacters;
      (mockCharacterStore.firstCharacter as Character | null) = mockCharacters[0]

      render(<CharacterSection title="First Section" isFirstSection={true} />)

      const characterCard = screen.getByTestId('character-card-1')
      fireEvent.click(characterCard)

      expect(mockCharacterStore.setFirstCharacter).not.toHaveBeenCalled()
    })

    it('shows active state for selected first character', () => {
      mockUseGetCharacters.characters = mockCharacters;
      (mockCharacterStore.firstCharacter as Character | null) = mockCharacters[0]

      render(<CharacterSection title="First Section" isFirstSection={true} />)

      const activeCard = screen.getByTestId('character-card-1')
      expect(activeCard).toHaveClass('active')
    })
  })

  describe('Character selection - Second Section', () => {
    it('sets second character when clicking on character card in second section', () => {
      mockUseGetCharacters.characters = mockCharacters

      render(<CharacterSection title="Second Section" isFirstSection={false} />)

      const characterCard = screen.getByTestId('character-card-1')
      fireEvent.click(characterCard)

      expect(mockCharacterStore.setSecondCharacter).toHaveBeenCalledWith(mockCharacters[0])
    })

    it('does not set second character if same character is already selected', () => {
      mockUseGetCharacters.characters = mockCharacters;
      (mockCharacterStore.secondCharacter as Character | null) = mockCharacters[0]

      render(<CharacterSection title="Second Section" isFirstSection={false} />)

      const characterCard = screen.getByTestId('character-card-1')
      fireEvent.click(characterCard)

      expect(mockCharacterStore.setSecondCharacter).not.toHaveBeenCalled()
    })

    it('shows active state for selected second character', () => {
      mockUseGetCharacters.characters = mockCharacters;
      (mockCharacterStore.secondCharacter as Character | null) = mockCharacters[0]

      render(<CharacterSection title="Second Section" isFirstSection={false} />)

      const activeCard = screen.getByTestId('character-card-1')
      expect(activeCard).toHaveClass('active')
    })
  })

  describe('Edge cases', () => {
    it('handles empty characters array', () => {
      mockUseGetCharacters.characters = []
      mockUseGetCharacters.loading = false

      render(<CharacterSection title="Test Section" />)

      expect(screen.queryByTestId(/character-card-/)).not.toBeInTheDocument()
    })

    it('handles null totalRecords', () => {
      mockUseGetCharacters.totalRecords = null

      render(<CharacterSection title="Test Section" />)

      expect(screen.getByTestId('paginator')).toBeInTheDocument()
    })

    it('renders correctly without isFirstSection prop', () => {
      mockUseGetCharacters.characters = mockCharacters

      render(<CharacterSection title="Test Section" />)

      const characterCard = screen.getByTestId('character-card-1')
      fireEvent.click(characterCard)

      expect(mockCharacterStore.setSecondCharacter).toHaveBeenCalledWith(mockCharacters[0])
    })
  })

  describe('Search functionality', () => {
    it('calls setName with empty string when search is cleared', async () => {
      const user = userEvent.setup()
      render(<CharacterSection title="Test Section" />)

      const searchInput = screen.getByTestId('search-input')
      await user.type(searchInput, 'Rick')
      await user.clear(searchInput)

      expect(mockUseGetCharacters.setName).toHaveBeenLastCalledWith('')
    })
  })

  describe('Status filter functionality', () => {
    it('handles status filter reset to all', async () => {
      const user = userEvent.setup()
      render(<CharacterSection title="Test Section" />)

      const dropdown = screen.getByTestId('status-dropdown')
      await user.selectOptions(dropdown, '')

      expect(mockUseGetCharacters.setStatus).toHaveBeenCalledWith(null)
    })
  })
})