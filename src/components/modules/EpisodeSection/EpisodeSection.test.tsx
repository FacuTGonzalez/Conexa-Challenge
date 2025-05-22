import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import EpisodeSection from './EpisodeSection'

// Mocks
jest.mock('@/store/characterStore', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/services/episodesServices/hooks/useEpisodeData/useEpisodeData', () => ({
  __esModule: true,
  default: jest.fn(),
}))

import useCharacterStore from '@/store/characterStore'
import useEpisodeData from '@/services/episodesServices/hooks/useEpisodeData/useEpisodeData'

describe('EpisodeSection', () => {
  const mockCharacter1 = { name: 'Rick Sanchez' }
  const mockCharacter2 = { name: 'Morty Smith' }

  const mockEpisodes1 = [
    { episode: 'S01E01', name: 'Pilot', air_date: 'December 2, 2013' },
    { episode: 'S01E03', name: 'Anatomy Park', air_date: 'December 16, 2013' },
  ]

  const mockEpisodes2 = [
    { episode: 'S01E04', name: 'M. Night Shaym-Aliens!', air_date: 'January 13, 2014' },
  ]

  const mockSharedEpisodes = [
    { episode: 'S01E02', name: 'Lawnmower Dog', air_date: 'December 9, 2013' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders "Please select characters" when no characters are selected', () => {
    ;(useCharacterStore as unknown as jest.Mock).mockReturnValue({
      firstCharacter: null,
      secondCharacter: null,
    })

    ;(useEpisodeData as jest.Mock).mockReturnValue({
      firstCharacterEpisodes: [],
      secondCharacterEpisodes: [],
      matchedCharacterEpisodes: [],
      bothCharactersSelected: false,
    })

    render(<EpisodeSection />)

    expect(screen.getAllByText('Please select characters')).toHaveLength(3)
  })

  it('renders character names and episodes correctly when both characters are selected', () => {
    ;(useCharacterStore as unknown as jest.Mock).mockReturnValue({
      firstCharacter: mockCharacter1,
      secondCharacter: mockCharacter2,
    })

    ;(useEpisodeData as jest.Mock).mockReturnValue({
      firstCharacterEpisodes: mockEpisodes1,
      secondCharacterEpisodes: mockEpisodes2,
      matchedCharacterEpisodes: mockSharedEpisodes,
      bothCharactersSelected: true,
    })

    render(<EpisodeSection />)

    expect(screen.getByText(/Character #1 \(Rick Sanchez\)/)).toBeInTheDocument()
    expect(screen.getByText(/Character #2 \(Morty Smith\)/)).toBeInTheDocument()

    expect(screen.getByText('S01E01-Pilot-December 2, 2013')).toBeInTheDocument()
    expect(screen.getByText('S01E03-Anatomy Park-December 16, 2013')).toBeInTheDocument()
    expect(screen.getByText('S01E04-M. Night Shaym-Aliens!-January 13, 2014')).toBeInTheDocument()

    expect(screen.getByText('S01E02-Lawnmower Dog-December 9, 2013')).toBeInTheDocument()
  })

  it('renders "No shared episodes" if matchedCharacterEpisodes is null', () => {
    ;(useCharacterStore as unknown as jest.Mock).mockReturnValue({
      firstCharacter: mockCharacter1,
      secondCharacter: mockCharacter2,
    })

    ;(useEpisodeData as jest.Mock).mockReturnValue({
      firstCharacterEpisodes: mockEpisodes1,
      secondCharacterEpisodes: mockEpisodes2,
      matchedCharacterEpisodes: null,
      bothCharactersSelected: true,
    })

    render(<EpisodeSection />)

    expect(screen.getByText('No shared episodes')).toBeInTheDocument()
  })
})
