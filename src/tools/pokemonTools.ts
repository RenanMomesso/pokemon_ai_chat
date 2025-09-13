import { Tool, Pokemon, TeamAnalysis } from '../types';
import { pokemonService } from '../services/PokemonService';
import {
  usePokemonLookup,
  useRandomPokemon,
  usePokemonByType,
  useTeamAnalysis,
  usePokemonSearch
} from '../hooks/usePokemonQueries';
import {
  PokemonLookupParams,
  PokemonSearchParams,
  PokemonByTypeParams,
  TeamAnalysisParams,
  ToolExecutionResult
} from './types';
import {
  POKEMON_TOOLS_CONFIG,
  POKEMON_TOOLS_ERRORS,
  POKEMON_TOOLS_MESSAGES
} from './pokemonTools.config';

// Pokemon Lookup Tool
export const pokemonLookupTool: Tool = {
  name: 'pokemon_lookup',
  description: 'Look up detailed information about a specific Pokemon by name or ID',
  parameters: {
    type: 'object',
    properties: {
      nameOrId: {
        type: 'string',
        description: 'The name or ID of the Pokemon to look up'
      }
    },
    required: ['nameOrId']
  },
  execute: async (args: PokemonLookupParams): Promise<ToolExecutionResult> => {
    try {
      // For tools, we still use the service directly but with caching benefits
      // The hooks are primarily for React components
      const pokemon = await pokemonService.fetchPokemon(args.nameOrId);
      return await pokemonService.formatPokemonWithDescription(pokemon);
    } catch (error) {
      return POKEMON_TOOLS_ERRORS.POKEMON_NOT_FOUND(args.nameOrId);
    }
  }
};

// Pokemon Search Tool
export const pokemonSearchTool: Tool = {
  name: 'pokemon_search',
  description: 'Search for Pokemon by partial name match',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query to find Pokemon'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 10)',
        default: POKEMON_TOOLS_CONFIG.defaultSearchLimit
      }
    },
    required: ['query']
  },
  execute: async (args: PokemonSearchParams): Promise<ToolExecutionResult> => {
    try {
      const limit = args.limit || POKEMON_TOOLS_CONFIG.defaultSearchLimit;
      const pokemon = await pokemonService.searchPokemon(args.query, limit);
      
      if (pokemon.length === 0) {
        return POKEMON_TOOLS_ERRORS.SEARCH_NO_RESULTS(args.query);
      }
      
      const results = pokemon.map(p => 
        `**${p.name.charAt(0).toUpperCase() + p.name.slice(1)}** (#${p.id}) - ${p.types.map(t => t.type.name).join(', ')}`
      ).join('\n');
      
      return `${POKEMON_TOOLS_MESSAGES.SEARCH_RESULTS_HEADER(pokemon.length, args.query)}\n\n${results}`;
    } catch (error) {
      return POKEMON_TOOLS_ERRORS.GENERAL_ERROR('searching for Pokemon', error);
    }
  }
};

// Pokemon by Type Tool
export const pokemonByTypeTool: Tool = {
  name: 'pokemon_by_type',
  description: 'Find Pokemon of a specific type',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        description: 'The Pokemon type to search for (e.g., fire, water, grass, electric)'
      }
    },
    required: ['type']
  },
  execute: async (args: PokemonByTypeParams): Promise<ToolExecutionResult> => {
    try {
      const pokemon = await pokemonService.getPokemonByType(args.type);
      
      const results = pokemon.map(p => 
        `**${p.name.charAt(0).toUpperCase() + p.name.slice(1)}** (#${p.id})`
      ).join('\n');
      
      return `${POKEMON_TOOLS_MESSAGES.TYPE_RESULTS_HEADER(args.type)}\n\n${results}`;
    } catch (error) {
      return POKEMON_TOOLS_ERRORS.INVALID_TYPE(args.type);
    }
  }
};

// Random Pokemon Tool
export const randomPokemonTool: Tool = {
  name: 'random_pokemon',
  description: 'Get information about a random Pokemon',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  },
  execute: async (): Promise<ToolExecutionResult> => {
    try {
      const pokemon = await pokemonService.getRandomPokemon();
      const formattedPokemon = await pokemonService.formatPokemonWithDescription(pokemon);
      return `${POKEMON_TOOLS_MESSAGES.RANDOM_POKEMON_HEADER}\n\n${formattedPokemon}`;
    } catch (error) {
      return POKEMON_TOOLS_ERRORS.RANDOM_POKEMON_ERROR;
    }
  }
};

// Team Analysis Tool
export const teamAnalysisTool: Tool = {
  name: 'analyze_pokemon_team',
  description: 'Analyze a Pokemon team for type coverage, weaknesses, and provide strategic recommendations',
  parameters: {
    type: 'object',
    properties: {
      pokemonNames: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of Pokemon names to analyze as a team (1-6 Pokemon)'
      }
    },
    required: ['pokemonNames']
  },
  execute: async (args: TeamAnalysisParams): Promise<ToolExecutionResult> => {
    try {
      const { pokemonNames } = args;
      
      if (pokemonNames.length === 0 || pokemonNames.length > POKEMON_TOOLS_CONFIG.maxTeamSize) {
        return POKEMON_TOOLS_ERRORS.TEAM_SIZE_ERROR;
      }

      // Fetch all Pokemon data
      const pokemonPromises = pokemonNames.map(name => 
        pokemonService.fetchPokemon(name.toLowerCase())
      );
      
      const team = await Promise.all(pokemonPromises);
      
      // Analyze team composition
      const analysis = analyzeTeam(team);
      
      // Format the analysis
      const teamNames = team.map(p => p.name.charAt(0).toUpperCase() + p.name.slice(1));
      let result = `${POKEMON_TOOLS_MESSAGES.TEAM_ANALYSIS_HEADER(teamNames)}\n\n`;
      
      result += `**Type Coverage:**\n${analysis.typeCoverage.join(', ')}\n\n`;
      
      result += `**Major Weaknesses:**\n${analysis.weaknesses.length > 0 ? analysis.weaknesses.join(', ') : 'None identified'}\n\n`;
      
      result += `**Team Strengths:**\n${analysis.strengths.join(', ')}\n\n`;
      
      result += `**Average Stats:**\n`;
      Object.entries(analysis.averageStats).forEach(([stat, value]) => {
        result += `- ${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${Math.round(value)}\n`;
      });
      
      result += `\n**Strategic Recommendations:**\n${analysis.recommendations.join('\n')}`;
      
      return result;
    } catch (error) {
      return POKEMON_TOOLS_ERRORS.TEAM_ANALYSIS_ERROR(error);
    }
  }
};

// Team analysis helper function
function analyzeTeam(team: Pokemon[]): TeamAnalysis {
  const typeWeaknesses: string[] = [];
  const typeStrengths: string[] = [];
  const typeCoverage = new Set<string>();
  const averageStats: Record<string, number> = {};
  
  // Collect all types and calculate average stats
  const statTotals: Record<string, number> = {};
  
  team.forEach(pokemon => {
    pokemon.types.forEach(type => {
      typeCoverage.add(type.type.name);
    });
    
    pokemon.stats.forEach(stat => {
      if (!statTotals[stat.stat.name]) {
        statTotals[stat.stat.name] = 0;
      }
      statTotals[stat.stat.name] += stat.base_stat;
    });
  });
  
  // Calculate averages
  Object.keys(statTotals).forEach(stat => {
    averageStats[stat] = statTotals[stat] / team.length;
  });
  
  // Type effectiveness analysis
  const coveredTypes = new Set<string>();
  Array.from(typeCoverage).forEach(type => {
    if (POKEMON_TOOLS_CONFIG.typeChart[type]) {
      POKEMON_TOOLS_CONFIG.typeChart[type].forEach(weakness => coveredTypes.add(weakness));
    }
  });
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (team.length < POKEMON_TOOLS_CONFIG.maxTeamSize) {
    recommendations.push(`• Consider adding ${POKEMON_TOOLS_CONFIG.maxTeamSize - team.length} more Pokemon to complete your team`);
  }
  
  if (averageStats.speed < POKEMON_TOOLS_CONFIG.statThresholds.speed) {
    recommendations.push('• Your team could benefit from faster Pokemon for better speed control');
  }
  
  if (averageStats.hp < POKEMON_TOOLS_CONFIG.statThresholds.hp) {
    recommendations.push('• Consider adding bulkier Pokemon with higher HP for better survivability');
  }
  
  if (!typeCoverage.has('steel') && !typeCoverage.has('fairy')) {
    recommendations.push('• Adding a Steel or Fairy type could provide valuable defensive utility');
  }
  
  if (coveredTypes.size < 10) {
    recommendations.push('• Your type coverage could be improved for better offensive options');
  }
  
  return {
    typeWeaknesses,
    typeStrengths,
    averageStats,
    recommendations,
    typeCoverage: Array.from(typeCoverage),
    weaknesses: [], // Simplified for now
    strengths: Array.from(coveredTypes)
  };
}

// Export all tools
export const pokemonTools = [
  pokemonLookupTool,
  pokemonSearchTool,
  pokemonByTypeTool,
  randomPokemonTool,
  teamAnalysisTool
];