import { PokemonService } from './PokemonService';
import { Pokemon, PokemonSpecies } from '../../types';
import { APIError } from '../../utils/errorHandler';

// Mock network utils
jest.mock('../../utils/networkUtils', () => ({
  networkUtils: {
    fetchWithRetry: jest.fn(),
  },
}));

// Mock error handler
jest.mock('../../utils/errorHandler', () => ({
  APIError: jest.fn(),
  NetworkError: jest.fn(),
  withErrorHandling: jest.fn((fn) => fn()),
}));

// Mock fetch
global.fetch = jest.fn();

const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [
    {
      slot: 1,
      type: {
        name: 'electric',
        url: 'https://pokeapi.co/api/v2/type/13/',
      },
    },
  ],
  abilities: [
    {
      ability: {
        name: 'static',
        url: 'https://pokeapi.co/api/v2/ability/9/',
      },
      is_hidden: false,
      slot: 1,
    },
  ],
  stats: [
    {
      base_stat: 35,
      effort: 0,
      stat: {
        name: 'hp',
        url: 'https://pokeapi.co/api/v2/stat/1/',
      },
    },
  ],
  sprites: {
    front_default: 'https://example.com/pikachu.png',
  },
};

const mockPokemonSpecies: PokemonSpecies = {
  id: 25,
  name: 'pikachu',
  flavor_text_entries: [
    {
      flavor_text: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
      language: {
        name: 'en',
        url: 'https://pokeapi.co/api/v2/language/9/',
      },
    },
  ],
  genera: [
    {
      genus: 'Mouse Pokémon',
      language: {
        name: 'en',
        url: 'https://pokeapi.co/api/v2/language/9/',
      },
    },
  ],
};

describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let mockFetch: jest.MockedFunction<typeof fetch>;
  let mockNetworkUtils: any;

  beforeEach(() => {
    jest.clearAllMocks();
    pokemonService = new PokemonService();
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockNetworkUtils = require('../../utils/networkUtils').networkUtils;
  });

  describe('fetchPokemon', () => {
    it('should fetch Pokemon successfully', async () => {
      mockNetworkUtils.fetchWithRetry.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPokemon),
      });

      const result = await pokemonService.fetchPokemon('pikachu');
      
      expect(result).toEqual(mockPokemon);
      expect(mockNetworkUtils.fetchWithRetry).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/pikachu'
      );
    });

    it('should return cached Pokemon if available', async () => {
      // First call
      mockNetworkUtils.fetchWithRetry.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPokemon),
      });

      await pokemonService.fetchPokemon('pikachu');
      
      // Second call should use cache
      const result = await pokemonService.fetchPokemon('pikachu');
      
      expect(result).toEqual(mockPokemon);
      expect(mockNetworkUtils.fetchWithRetry).toHaveBeenCalledTimes(1);
    });

    it('should handle 404 errors', async () => {
      mockNetworkUtils.fetchWithRetry.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(pokemonService.fetchPokemon('nonexistent')).rejects.toThrow();
    });
  });

  describe('fetchPokemonSpecies', () => {
    it('should fetch Pokemon species successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPokemonSpecies),
      } as any);

      const result = await pokemonService.fetchPokemonSpecies('pikachu');
      
      expect(result).toEqual(mockPokemonSpecies);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon-species/pikachu'
      );
    });

    it('should handle species not found', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      } as any);

      await expect(pokemonService.fetchPokemonSpecies('nonexistent')).rejects.toThrow();
    });
  });

  describe('searchPokemon', () => {
    it('should search Pokemon successfully', async () => {
      const mockSearchResponse = {
        results: [
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
          { name: 'pichu', url: 'https://pokeapi.co/api/v2/pokemon/172/' },
        ],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSearchResponse),
      } as any);

      mockNetworkUtils.fetchWithRetry.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPokemon),
      });

      const result = await pokemonService.searchPokemon('pik');
      
      expect(result).toHaveLength(2);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=1000'
      );
    });
  });

  describe('getRandomPokemon', () => {
    it('should get a random Pokemon', async () => {
      mockNetworkUtils.fetchWithRetry.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPokemon),
      });

      const result = await pokemonService.getRandomPokemon();
      
      expect(result).toEqual(mockPokemon);
      expect(mockNetworkUtils.fetchWithRetry).toHaveBeenCalled();
    });
  });

  describe('formatPokemonInfo', () => {
    it('should format Pokemon info correctly', () => {
      const result = pokemonService.formatPokemonInfo(mockPokemon);
      
      expect(result).toContain('**Pikachu** (#25)');
      expect(result).toContain('**Type(s):** electric');
      expect(result).toContain('**Height:** 0.4m');
      expect(result).toContain('**Weight:** 6kg');
      expect(result).toContain('**Abilities:** static');
      expect(result).toContain('**Base Stats:** hp: 35');
      expect(result).toContain('**Base Experience:** 112');
    });

    it('should format Pokemon info with options', () => {
      const result = pokemonService.formatPokemonInfo(mockPokemon, {
        includeTypes: false,
        includeAbilities: false,
        includeStats: false,
      });
      
      expect(result).toContain('**Pikachu** (#25)');
      expect(result).not.toContain('**Type(s):**');
      expect(result).not.toContain('**Abilities:**');
      expect(result).not.toContain('**Base Stats:**');
    });
  });

  describe('formatPokemonWithDescription', () => {
    it('should format Pokemon with description', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPokemonSpecies),
      } as any);

      const result = await pokemonService.formatPokemonWithDescription(mockPokemon);
      
      expect(result).toContain('**Pikachu** (#25)');
      expect(result).toContain('**Species:** Mouse Pokémon');
      expect(result).toContain('**Description:** When several of these Pokémon gather');
    });

    it('should fallback to basic info if species fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Species not found'));

      const result = await pokemonService.formatPokemonWithDescription(mockPokemon);
      
      expect(result).toContain('**Pikachu** (#25)');
      expect(result).not.toContain('**Species:**');
      expect(result).not.toContain('**Description:**');
    });
  });

  describe('clearCache', () => {
    it('should clear the cache', () => {
      // Add something to cache first
      pokemonService['cache'].set('test', 'value');
      expect(pokemonService['cache'].size).toBe(1);
      
      pokemonService.clearCache();
      expect(pokemonService['cache'].size).toBe(0);
    });
  });
});