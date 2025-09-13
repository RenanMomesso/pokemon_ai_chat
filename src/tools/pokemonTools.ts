import { Tool } from '../types';
import { pokemonService } from '../services/PokemonService';
import { POKEMON_CONFIG, POKEMON_ERRORS, POKEMON_MESSAGES } from './pokemonTools.config';

export const pokemonLookupTool: Tool = {
  name: 'pokemon_lookup',
  description: 'Look up a Pokemon by name or ID',
  parameters: {
    type: 'object',
    properties: {
      nameOrId: {
        type: 'string',
        description: 'Pokemon name or ID'
      }
    },
    required: ['nameOrId']
  },
  execute: async (args: { nameOrId: string }) => {
    try {
      const pokemon = await pokemonService.fetchPokemon(args.nameOrId);
      const species = await pokemonService.fetchPokemonSpecies(args.nameOrId);
      
      const types = pokemon.types.map((t: any) => t.type.name).join(', ');
      const description = species.flavor_text_entries
        .find((entry: any) => entry.language.name === 'en')
        ?.flavor_text.replace(/\f/g, ' ') || 'No description available.';
      
      return `**${pokemon.name}** (#${pokemon.id})\nType: ${types}\nHeight: ${pokemon.height / 10}m\nWeight: ${pokemon.weight / 10}kg\n\n${description}`;
    } catch (error) {
      return POKEMON_ERRORS.notFound(args.nameOrId);
    }
  }
};

export const pokemonSearchTool: Tool = {
  name: 'pokemon_search',
  description: 'Search for Pokemon by name',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search term'
      }
    },
    required: ['query']
  },
  execute: async (args: { query: string }) => {
    try {
      const pokemonList = await pokemonService.fetchPokemonList(1000, 0);
      const matches = pokemonList.results
        .filter((p: any) => p.name.includes(args.query.toLowerCase()))
        .slice(0, POKEMON_CONFIG.searchLimit);
      
      if (matches.length === 0) {
        return POKEMON_ERRORS.noResults(args.query);
      }
      
      const results = matches.map((p: any) => `• ${p.name}`).join('\n');
      return `${POKEMON_MESSAGES.searchResults(matches.length, args.query)}\n\n${results}`;
    } catch (error) {
      return POKEMON_ERRORS.generalError;
    }
  }
};

export const randomPokemonTool: Tool = {
  name: 'random_pokemon',
  description: 'Get a random Pokemon',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  },
  execute: async () => {
    try {
      const randomId = Math.floor(Math.random() * 1010) + 1;
      const pokemon = await pokemonService.fetchPokemon(randomId);
      const species = await pokemonService.fetchPokemonSpecies(randomId);
      
      const types = pokemon.types.map((t: any) => t.type.name).join(', ');
      const description = species.flavor_text_entries
        .find((entry: any) => entry.language.name === 'en')
        ?.flavor_text.replace(/\f/g, ' ') || 'No description available.';
      
      return `${POKEMON_MESSAGES.randomPokemon}\n\n**${pokemon.name}** (#${pokemon.id})\nType: ${types}\n\n${description}`;
    } catch (error) {
      return POKEMON_ERRORS.generalError;
    }
  }
};

export const pokemonStrengthTool: Tool = {
  name: 'pokemon_strength',
  description: 'Find the strongest Pokemon based on various criteria (total stats, attack, defense, etc.)',
  parameters: {
    type: 'object',
    properties: {
      criteria: {
        type: 'string',
        description: 'Strength criteria: "total", "attack", "defense", "hp", "speed", "special-attack", "special-defense"',
        enum: ['total', 'attack', 'defense', 'hp', 'speed', 'special-attack', 'special-defense']
      },
      limit: {
        type: 'number',
        description: 'Number of top Pokemon to return (default: 5)',
        default: 5
      }
    },
    required: ['criteria']
  },
  execute: async (args: { criteria: string; limit?: number }) => {
    try {
      const limit = args.limit || 5;
      const pokemonToCheck = [
        'mewtwo', 'mew', 'lugia', 'ho-oh', 'celebi', 'kyogre', 'groudon', 'rayquaza',
        'dialga', 'palkia', 'giratina', 'arceus', 'reshiram', 'zekrom', 'kyurem',
        'xerneas', 'yveltal', 'zygarde', 'solgaleo', 'lunala', 'necrozma',
        'zacian', 'zamazenta', 'eternatus', 'calyrex',
        'dragonite', 'tyranitar', 'salamence', 'metagross', 'garchomp', 'hydreigon',
        'goodra', 'kommo-o', 'dragapult', 'slaking', 'regigigas'
      ];

      const pokemonStats = [];
      
      for (const pokemonName of pokemonToCheck) {
        try {
          const pokemon = await pokemonService.fetchPokemon(pokemonName);
          const stats = pokemon.stats.reduce((acc: any, stat: any) => {
            acc[stat.stat.name] = stat.base_stat;
            return acc;
          }, {});
          
          const totalStats = pokemon.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0);
          
          pokemonStats.push({
            name: pokemon.name,
            id: pokemon.id,
            types: pokemon.types.map((t: any) => t.type.name),
            stats: {
              ...stats,
              total: totalStats
            }
          });
        } catch (error) {
          continue;
        }
      }

      const sortedPokemon = pokemonStats.sort((a, b) => {
        const statA = a.stats[args.criteria] || 0;
        const statB = b.stats[args.criteria] || 0;
        return statB - statA;
      }).slice(0, limit);

      if (sortedPokemon.length === 0) {
        return 'Unable to fetch Pokemon strength data at the moment.';
      }

      const criteriaName = args.criteria === 'total' ? 'Total Base Stats' : 
                          args.criteria.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      let result = `**Top ${limit} Strongest Pokemon by ${criteriaName}:**\n\n`;
      
      sortedPokemon.forEach((pokemon, index) => {
        const types = pokemon.types.join(', ');
        const statValue = pokemon.stats[args.criteria];
        result += `**${index + 1}. ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}** (#${pokemon.id})\n`;
        result += `Type: ${types}\n`;
        result += `${criteriaName}: ${statValue}\n`;
        if (args.criteria === 'total') {
          result += `Stats breakdown: HP: ${pokemon.stats.hp}, Attack: ${pokemon.stats.attack}, Defense: ${pokemon.stats.defense}, Sp.Atk: ${pokemon.stats['special-attack']}, Sp.Def: ${pokemon.stats['special-defense']}, Speed: ${pokemon.stats.speed}\n`;
        }
        result += '\n';
      });
      
      return result;
    } catch (error) {
      return 'Unable to analyze Pokemon strength data. Please try again later.';
    }
  }
};

export const pokemonTools = [
  pokemonLookupTool,
  pokemonSearchTool,
  randomPokemonTool,
  pokemonStrengthTool
];