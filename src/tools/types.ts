import { Pokemon, PokemonTeam, TeamAnalysis } from '../types';

// Tool parameter types
export interface PokemonLookupParams {
  nameOrId: string;
}

export interface PokemonSearchParams {
  query: string;
  limit?: number;
}

export interface PokemonByTypeParams {
  type: string;
}

export type RandomPokemonParams = Record<string, never>;

export interface TeamAnalysisParams {
  pokemonNames: string[];
}

// Tool execution result types
export type ToolExecutionResult = string;

// Tool configuration types
export interface ToolParameter {
  type: string;
  description: string;
  default?: any;
  items?: {
    type: string;
  };
}

export interface ToolParameters {
  type: 'object';
  properties: Record<string, ToolParameter>;
  required: string[];
}

export interface Tool {
  name: string;
  description: string;
  parameters: ToolParameters;
  execute: (args: any) => Promise<ToolExecutionResult>;
}

// Pokemon tools specific types
export interface PokemonToolsConfig {
  defaultSearchLimit: number;
  maxTeamSize: number;
  minTeamSize: number;
  typeChart: Record<string, string[]>;
  statThresholds: {
    speed: number;
    hp: number;
  };
}

// Team analysis types
export interface TeamStats {
  averageStats: Record<string, number>;
  typeCoverage: string[];
  weaknesses: string[];
  strengths: string[];
}

export interface TeamRecommendation {
  type: 'speed' | 'bulk' | 'coverage' | 'type' | 'general';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ExtendedTeamAnalysis extends TeamAnalysis {
  recommendations: TeamRecommendation[];
  teamStats: TeamStats;
}

// Export all tool types
export type PokemonToolParams = 
  | PokemonLookupParams 
  | PokemonSearchParams 
  | PokemonByTypeParams 
  | RandomPokemonParams 
  | TeamAnalysisParams;

export type PokemonToolName = 
  | 'pokemon_lookup'
  | 'pokemon_search'
  | 'pokemon_by_type'
  | 'random_pokemon'
  | 'analyze_pokemon_team';