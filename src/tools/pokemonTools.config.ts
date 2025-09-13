import { PokemonToolsConfig } from './types';

// Pokemon tools configuration
export const POKEMON_TOOLS_CONFIG: PokemonToolsConfig = {
  defaultSearchLimit: 10,
  maxTeamSize: 6,
  minTeamSize: 1,
  statThresholds: {
    speed: 70,
    hp: 80
  },
  typeChart: {
    fire: ['grass', 'ice', 'bug', 'steel'],
    water: ['fire', 'ground', 'rock'],
    grass: ['water', 'ground', 'rock'],
    electric: ['water', 'flying'],
    psychic: ['fighting', 'poison'],
    ice: ['grass', 'ground', 'flying', 'dragon'],
    dragon: ['dragon'],
    dark: ['psychic', 'ghost'],
    fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
    poison: ['grass', 'fairy'],
    ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
    flying: ['grass', 'fighting', 'bug'],
    bug: ['grass', 'psychic', 'dark'],
    rock: ['fire', 'ice', 'flying', 'bug'],
    ghost: ['psychic', 'ghost'],
    steel: ['ice', 'rock', 'fairy'],
    fairy: ['fighting', 'dragon', 'dark']
  }
};

// Error messages
export const POKEMON_TOOLS_ERRORS = {
  POKEMON_NOT_FOUND: (name: string) => `Sorry, I couldn't find information about "${name}". Please check the spelling or try a different Pokemon name or ID.`,
  SEARCH_NO_RESULTS: (query: string) => `No Pokemon found matching "${query}". Try a different search term.`,
  INVALID_TYPE: (type: string) => `Error finding ${type}-type Pokemon. Please check if "${type}" is a valid Pokemon type.`,
  TEAM_SIZE_ERROR: 'Please provide 1-6 Pokemon names for team analysis.',
  TEAM_ANALYSIS_ERROR: (error: any) => `Error analyzing team: ${error}. Please check that all Pokemon names are spelled correctly.`,
  RANDOM_POKEMON_ERROR: 'Sorry, I encountered an error while finding a random Pokemon. Please try again.',
  GENERAL_ERROR: (operation: string, error: any) => `Error ${operation}: ${error}`
};

// Success messages
export const POKEMON_TOOLS_MESSAGES = {
  RANDOM_POKEMON_HEADER: '🎲 **Random Pokemon Discovery!**',
  TEAM_ANALYSIS_HEADER: (teamNames: string[]) => `🔍 **Team Analysis for: ${teamNames.join(', ')}**`,
  SEARCH_RESULTS_HEADER: (count: number, query: string) => `Found ${count} Pokemon matching "${query}":`,
  TYPE_RESULTS_HEADER: (type: string) => `Here are some ${type.charAt(0).toUpperCase() + type.slice(1)}-type Pokemon:`
};