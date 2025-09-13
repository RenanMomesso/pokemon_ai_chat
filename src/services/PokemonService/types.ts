import { Pokemon, PokemonSpecies } from '../../types';

export interface PokemonServiceConfig {
  baseUrl: string;
  cacheEnabled: boolean;
  defaultLimit: number;
  maxPokemonId: number;
}

export interface PokemonServiceInterface {
  fetchPokemon(nameOrId: string | number): Promise<Pokemon>;
  fetchPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies>;
  searchPokemon(query: string, limit?: number): Promise<Pokemon[]>;
  getRandomPokemon(): Promise<Pokemon>;
  getPokemonByType(typeName: string): Promise<Pokemon[]>;
  formatPokemonInfo(pokemon: Pokemon): string;
  formatPokemonWithDescription(pokemon: Pokemon): Promise<string>;
  clearCache(): void;
}

export interface PokemonSearchResult {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonSearchResult[];
}

export interface TypeResponse {
  id: number;
  name: string;
  pokemon: {
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }[];
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface PokemonFormattingOptions {
  includeDescription?: boolean;
  includeStats?: boolean;
  includeAbilities?: boolean;
  includeTypes?: boolean;
}