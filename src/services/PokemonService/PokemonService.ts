const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokemonService {
  async fetchPokemon(nameOrId: string | number) {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) {
      throw new Error(`Pokemon not found: ${nameOrId}`);
    }
    return response.json();
  }

  async fetchPokemonSpecies(nameOrId: string | number) {
    const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);
    if (!response.ok) {
      throw new Error(`Pokemon species not found: ${nameOrId}`);
    }
    return response.json();
  }

  async fetchType(typeId: string | number) {
    const response = await fetch(`${BASE_URL}/type/${typeId}`);
    if (!response.ok) {
      throw new Error(`Type not found: ${typeId}`);
    }
    return response.json();
  }

  async fetchAbility(abilityName: string) {
    const response = await fetch(`${BASE_URL}/ability/${abilityName}`);
    if (!response.ok) {
      throw new Error(`Ability not found: ${abilityName}`);
    }
    return response.json();
  }

  async fetchPokemonList(limit: number = 100000, offset: number = 0) {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    return response.json();
  }
}