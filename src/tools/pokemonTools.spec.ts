import {
  pokemonLookupTool,
  pokemonSearchTool,
  pokemonByTypeTool,
  randomPokemonTool,
  teamAnalysisTool,
  pokemonTools
} from './pokemonTools';
import { pokemonService } from '../services/PokemonService';
import { Pokemon } from '../types';

// Mock the pokemon service
jest.mock('../services/PokemonService', () => ({
  pokemonService: {
    fetchPokemon: jest.fn(),
    formatPokemonWithDescription: jest.fn(),
    searchPokemon: jest.fn(),
    getPokemonByType: jest.fn(),
    getRandomPokemon: jest.fn()
  }
}));

const mockPokemonService = pokemonService as jest.Mocked<typeof pokemonService>;

// Mock Pokemon data
const mockPikachu: Pokemon = {
  id: 25,
  name: 'pikachu',
  types: [{ type: { name: 'electric' } }],
  stats: [
    { stat: { name: 'hp' }, base_stat: 35 },
    { stat: { name: 'attack' }, base_stat: 55 },
    { stat: { name: 'defense' }, base_stat: 40 },
    { stat: { name: 'special-attack' }, base_stat: 50 },
    { stat: { name: 'special-defense' }, base_stat: 50 },
    { stat: { name: 'speed' }, base_stat: 90 }
  ]
} as Pokemon;

const mockCharizard: Pokemon = {
  id: 6,
  name: 'charizard',
  types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
  stats: [
    { stat: { name: 'hp' }, base_stat: 78 },
    { stat: { name: 'attack' }, base_stat: 84 },
    { stat: { name: 'defense' }, base_stat: 78 },
    { stat: { name: 'special-attack' }, base_stat: 109 },
    { stat: { name: 'special-defense' }, base_stat: 85 },
    { stat: { name: 'speed' }, base_stat: 100 }
  ]
} as Pokemon;

describe('Pokemon Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('pokemonLookupTool', () => {
    it('should return formatted Pokemon information when found', async () => {
      const mockFormattedInfo = 'Pikachu - Electric Mouse Pokemon';
      mockPokemonService.fetchPokemon.mockResolvedValue(mockPikachu);
      mockPokemonService.formatPokemonWithDescription.mockResolvedValue(mockFormattedInfo);

      const result = await pokemonLookupTool.execute({ nameOrId: 'pikachu' });

      expect(mockPokemonService.fetchPokemon).toHaveBeenCalledWith('pikachu');
      expect(mockPokemonService.formatPokemonWithDescription).toHaveBeenCalledWith(mockPikachu);
      expect(result).toBe(mockFormattedInfo);
    });

    it('should return error message when Pokemon not found', async () => {
      mockPokemonService.fetchPokemon.mockRejectedValue(new Error('Not found'));

      const result = await pokemonLookupTool.execute({ nameOrId: 'invalidpokemon' });

      expect(result).toContain('Sorry, I couldn\'t find information about "invalidpokemon"');
    });
  });

  describe('pokemonSearchTool', () => {
    it('should return search results when Pokemon found', async () => {
      const mockSearchResults = [mockPikachu, mockCharizard];
      mockPokemonService.searchPokemon.mockResolvedValue(mockSearchResults);

      const result = await pokemonSearchTool.execute({ query: 'pika', limit: 10 });

      expect(mockPokemonService.searchPokemon).toHaveBeenCalledWith('pika', 10);
      expect(result).toContain('Found 2 Pokemon matching "pika"');
      expect(result).toContain('**Pikachu** (#25)');
      expect(result).toContain('**Charizard** (#6)');
    });

    it('should return no results message when no Pokemon found', async () => {
      mockPokemonService.searchPokemon.mockResolvedValue([]);

      const result = await pokemonSearchTool.execute({ query: 'xyz' });

      expect(result).toContain('No Pokemon found matching "xyz"');
    });

    it('should use default limit when not provided', async () => {
      mockPokemonService.searchPokemon.mockResolvedValue([mockPikachu]);

      await pokemonSearchTool.execute({ query: 'pika' });

      expect(mockPokemonService.searchPokemon).toHaveBeenCalledWith('pika', 10);
    });
  });

  describe('pokemonByTypeTool', () => {
    it('should return Pokemon of specified type', async () => {
      const mockElectricPokemon = [mockPikachu];
      mockPokemonService.getPokemonByType.mockResolvedValue(mockElectricPokemon);

      const result = await pokemonByTypeTool.execute({ type: 'electric' });

      expect(mockPokemonService.getPokemonByType).toHaveBeenCalledWith('electric');
      expect(result).toContain('Here are some Electric-type Pokemon');
      expect(result).toContain('**Pikachu** (#25)');
    });

    it('should return error message for invalid type', async () => {
      mockPokemonService.getPokemonByType.mockRejectedValue(new Error('Invalid type'));

      const result = await pokemonByTypeTool.execute({ type: 'invalidtype' });

      expect(result).toContain('Error finding invalidtype-type Pokemon');
    });
  });

  describe('randomPokemonTool', () => {
    it('should return random Pokemon information', async () => {
      const mockFormattedInfo = 'Pikachu - Electric Mouse Pokemon';
      mockPokemonService.getRandomPokemon.mockResolvedValue(mockPikachu);
      mockPokemonService.formatPokemonWithDescription.mockResolvedValue(mockFormattedInfo);

      const result = await randomPokemonTool.execute({});

      expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
      expect(mockPokemonService.formatPokemonWithDescription).toHaveBeenCalledWith(mockPikachu);
      expect(result).toContain('🎲 **Random Pokemon Discovery!**');
      expect(result).toContain(mockFormattedInfo);
    });

    it('should return error message when random Pokemon fails', async () => {
      mockPokemonService.getRandomPokemon.mockRejectedValue(new Error('Service error'));

      const result = await randomPokemonTool.execute({});

      expect(result).toContain('Sorry, I encountered an error while finding a random Pokemon');
    });
  });

  describe('teamAnalysisTool', () => {
    it('should analyze a valid team', async () => {
      const mockTeam = [mockPikachu, mockCharizard];
      mockPokemonService.fetchPokemon
        .mockResolvedValueOnce(mockPikachu)
        .mockResolvedValueOnce(mockCharizard);

      const result = await teamAnalysisTool.execute({ pokemonNames: ['pikachu', 'charizard'] });

      expect(mockPokemonService.fetchPokemon).toHaveBeenCalledTimes(2);
      expect(result).toContain('🔍 **Team Analysis for: Pikachu, Charizard**');
      expect(result).toContain('**Type Coverage:**');
      expect(result).toContain('**Average Stats:**');
      expect(result).toContain('**Strategic Recommendations:**');
    });

    it('should return error for invalid team size', async () => {
      const result = await teamAnalysisTool.execute({ pokemonNames: [] });

      expect(result).toBe('Please provide 1-6 Pokemon names for team analysis.');
    });

    it('should return error for too many Pokemon', async () => {
      const tooManyPokemon = Array(7).fill('pikachu');
      const result = await teamAnalysisTool.execute({ pokemonNames: tooManyPokemon });

      expect(result).toBe('Please provide 1-6 Pokemon names for team analysis.');
    });

    it('should handle Pokemon fetch errors', async () => {
      mockPokemonService.fetchPokemon.mockRejectedValue(new Error('Pokemon not found'));

      const result = await teamAnalysisTool.execute({ pokemonNames: ['invalidpokemon'] });

      expect(result).toContain('Error analyzing team');
      expect(result).toContain('Please check that all Pokemon names are spelled correctly');
    });
  });

  describe('pokemonTools array', () => {
    it('should export all tools', () => {
      expect(pokemonTools).toHaveLength(5);
      expect(pokemonTools).toContain(pokemonLookupTool);
      expect(pokemonTools).toContain(pokemonSearchTool);
      expect(pokemonTools).toContain(pokemonByTypeTool);
      expect(pokemonTools).toContain(randomPokemonTool);
      expect(pokemonTools).toContain(teamAnalysisTool);
    });

    it('should have correct tool names', () => {
      const toolNames = pokemonTools.map(tool => tool.name);
      expect(toolNames).toEqual([
        'pokemon_lookup',
        'pokemon_search',
        'pokemon_by_type',
        'random_pokemon',
        'analyze_pokemon_team'
      ]);
    });
  });
});