export const POKEMON_CONFIG = {
  searchLimit: 5
};

export const POKEMON_ERRORS = {
  notFound: (name: string) => `Pokemon "${name}" not found.`,
  noResults: (query: string) => `No Pokemon found for "${query}".`,
  invalidType: (type: string) => `"${type}" is not a valid Pokemon type.`,
  generalError: 'Something went wrong. Please try again.'
};

export const POKEMON_MESSAGES = {
  searchResults: (count: number, query: string) => `Found ${count} Pokemon for "${query}":`,
  typeResults: (count: number, type: string) => `Found ${count} ${type} Pokemon:`,
  randomPokemon: 'Random Pokemon:'
};