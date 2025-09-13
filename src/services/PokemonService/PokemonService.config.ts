export const POKEMON_SERVICE_CONFIG = {
  baseUrl: 'https://pokeapi.co/api/v2',
  cacheEnabled: true,
  defaultLimit: 20,
  maxPokemonId: 1010, // Gen 1-9 Pokemon
  searchLimit: 1000,
  typeLimit: 20,
  cache: {
    ttl: 1000 * 60 * 60, // 1 hour
    maxSize: 1000,
  },
  endpoints: {
    pokemon: '/pokemon',
    species: '/pokemon-species',
    type: '/type',
  },
  errorMessages: {
    pokemonNotFound: 'Pokemon not found',
    speciesNotFound: 'Pokemon species not found',
    typeNotFound: 'Type not found',
    fetchFailed: 'Failed to fetch Pokemon data',
    networkError: 'Network error occurred',
  },
  formatting: {
    heightDivisor: 10, // Convert decimeters to meters
    weightDivisor: 10, // Convert hectograms to kilograms
    defaultDescription: 'No description available.',
    defaultGenus: 'Unknown',
  },
};

export const POKEMON_ENDPOINTS = {
  POKEMON: (nameOrId: string | number) => `${POKEMON_SERVICE_CONFIG.baseUrl}/pokemon/${nameOrId.toString().toLowerCase()}`,
  SPECIES: (nameOrId: string | number) => `${POKEMON_SERVICE_CONFIG.baseUrl}/pokemon-species/${nameOrId.toString().toLowerCase()}`,
  TYPE: (typeName: string) => `${POKEMON_SERVICE_CONFIG.baseUrl}/type/${typeName.toLowerCase()}`,
  POKEMON_LIST: (limit: number) => `${POKEMON_SERVICE_CONFIG.baseUrl}/pokemon?limit=${limit}`,
} as const;