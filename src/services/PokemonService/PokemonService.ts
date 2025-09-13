import { Pokemon, PokemonSpecies } from '../../types';
import { networkUtils } from '../../utils/networkUtils';
import { APIError, NetworkError, withErrorHandling } from '../../utils/errorHandler';
import {
  PokemonServiceInterface,
  PokemonListResponse,
  TypeResponse,
  PokemonSearchResult,
  PokemonFormattingOptions,
} from './types';
import { POKEMON_SERVICE_CONFIG, POKEMON_ENDPOINTS } from './PokemonService.config';

export class PokemonService implements PokemonServiceInterface {
  private cache = new Map<string, any>();

  async fetchPokemon(nameOrId: string | number): Promise<Pokemon> {
    const cacheKey = `pokemon-${nameOrId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    return withErrorHandling(async () => {
      const response = await networkUtils.fetchWithRetry(
        POKEMON_ENDPOINTS.POKEMON(nameOrId)
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new APIError(`${POKEMON_SERVICE_CONFIG.errorMessages.pokemonNotFound}: ${nameOrId}`, 404);
        }
        throw new APIError(`${POKEMON_SERVICE_CONFIG.errorMessages.fetchFailed}: ${response.statusText}`, response.status);
      }

      const pokemon: Pokemon = await response.json();
      this.cache.set(cacheKey, pokemon);
      
      return pokemon;
    }, 'Fetching Pokemon data');
  }

  async fetchPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
    const cacheKey = `species-${nameOrId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(POKEMON_ENDPOINTS.SPECIES(nameOrId));
      
      if (!response.ok) {
        throw new Error(`${POKEMON_SERVICE_CONFIG.errorMessages.speciesNotFound}: ${nameOrId}`);
      }

      const species: PokemonSpecies = await response.json();
      this.cache.set(cacheKey, species);
      
      return species;
    } catch (error) {
      console.error('Error fetching Pokemon species:', error);
      throw error;
    }
  }

  async searchPokemon(query: string, limit: number = POKEMON_SERVICE_CONFIG.defaultLimit): Promise<Pokemon[]> {
    try {
      // First, get the list of all Pokemon
      const response = await fetch(POKEMON_ENDPOINTS.POKEMON_LIST(POKEMON_SERVICE_CONFIG.searchLimit));
      const data: PokemonListResponse = await response.json();
      
      // Filter Pokemon that match the query
      const matchingPokemon = data.results
        .filter((pokemon: PokemonSearchResult) => 
          pokemon.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit);

      // Fetch detailed data for each matching Pokemon
      const pokemonPromises = matchingPokemon.map((pokemon: PokemonSearchResult) => 
        this.fetchPokemon(pokemon.name)
      );

      return await Promise.all(pokemonPromises);
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      throw error;
    }
  }

  async getRandomPokemon(): Promise<Pokemon> {
    const randomId = Math.floor(Math.random() * POKEMON_SERVICE_CONFIG.maxPokemonId) + 1;
    return this.fetchPokemon(randomId);
  }

  async getPokemonByType(typeName: string): Promise<Pokemon[]> {
    const cacheKey = `type-${typeName}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(POKEMON_ENDPOINTS.TYPE(typeName));
      
      if (!response.ok) {
        throw new Error(`${POKEMON_SERVICE_CONFIG.errorMessages.typeNotFound}: ${typeName}`);
      }

      const typeData: TypeResponse = await response.json();
      const pokemonList = typeData.pokemon.slice(0, POKEMON_SERVICE_CONFIG.typeLimit);
      
      const pokemonPromises = pokemonList.map((entry: any) => 
        this.fetchPokemon(entry.pokemon.name)
      );

      const pokemon = await Promise.all(pokemonPromises);
      this.cache.set(cacheKey, pokemon);
      
      return pokemon;
    } catch (error) {
      console.error('Error fetching Pokemon by type:', error);
      throw error;
    }
  }

  formatPokemonInfo(pokemon: Pokemon, options: PokemonFormattingOptions = {}): string {
    const {
      includeTypes = true,
      includeAbilities = true,
      includeStats = true,
    } = options;

    let info = `**${this.capitalizeFirstLetter(pokemon.name)}** (#${pokemon.id})\n`;
    
    if (includeTypes) {
      const types = pokemon.types.map(t => t.type.name).join(', ');
      info += `**Type(s):** ${types}\n`;
    }
    
    info += `**Height:** ${pokemon.height / POKEMON_SERVICE_CONFIG.formatting.heightDivisor}m\n`;
    info += `**Weight:** ${pokemon.weight / POKEMON_SERVICE_CONFIG.formatting.weightDivisor}kg\n`;
    
    if (includeAbilities) {
      const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');
      info += `**Abilities:** ${abilities}\n`;
    }
    
    if (includeStats) {
      const stats = pokemon.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join(', ');
      info += `**Base Stats:** ${stats}\n`;
    }
    
    info += `**Base Experience:** ${pokemon.base_experience}`;
    
    return info;
  }

  async formatPokemonWithDescription(pokemon: Pokemon): Promise<string> {
    try {
      const species = await this.fetchPokemonSpecies(pokemon.id);
      const description = species.flavor_text_entries
        .find(entry => entry.language.name === 'en')
        ?.flavor_text.replace(/\f/g, ' ') || POKEMON_SERVICE_CONFIG.formatting.defaultDescription;
      
      const genus = species.genera
        .find(g => g.language.name === 'en')
        ?.genus || POKEMON_SERVICE_CONFIG.formatting.defaultGenus;
      
      return this.formatPokemonInfo(pokemon) + 
             `\n**Species:** ${genus}\n` +
             `**Description:** ${description}`;
    } catch (error) {
      return this.formatPokemonInfo(pokemon);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}