import { PokemonService } from './PokemonService';

export { PokemonService } from './PokemonService';
export type {
  Pokemon,
  PokemonSpecies,
  PokemonType,
  PokemonAbility,
  PokemonListResponse,
} from './types';

export const pokemonService = new PokemonService();