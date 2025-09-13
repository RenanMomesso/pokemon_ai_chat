import { PokemonService } from './PokemonService';

export { PokemonService } from './PokemonService';
export { POKEMON_SERVICE_CONFIG, POKEMON_ENDPOINTS } from './PokemonService.config';
export type {
  PokemonServiceConfig,
  PokemonServiceInterface,
  PokemonSearchResult,
  PokemonListResponse,
  TypeResponse,
  CacheEntry,
  PokemonFormattingOptions,
} from './types';

// Create and export singleton instance
export const pokemonService = new PokemonService();