import { QueryClient } from '@tanstack/react-query';
import { pokemonService } from '../services/PokemonService';
import { POKEMON_QUERY_KEYS } from '../hooks/usePokemonQueries';

/**
 * Extract Pokemon names from user messages for prefetching
 */
export function extractPokemonNames(message: string): string[] {
  const pokemonKeywords = [
    'pikachu', 'charizard', 'blastoise', 'venusaur', 'alakazam', 'machamp',
    'gengar', 'dragonite', 'mewtwo', 'mew', 'typhlosion', 'feraligatr',
    'meganium', 'lugia', 'ho-oh', 'celebi', 'blaziken', 'swampert',
    'sceptile', 'rayquaza', 'kyogre', 'groudon', 'garchomp', 'lucario',
    'dialga', 'palkia', 'giratina', 'arceus', 'serperior', 'emboar',
    'samurott', 'reshiram', 'zekrom', 'kyurem', 'greninja', 'talonflame',
    'chesnaught', 'xerneas', 'yveltal', 'zygarde', 'decidueye', 'incineroar',
    'primarina', 'solgaleo', 'lunala', 'necrozma', 'rillaboom', 'cinderace',
    'inteleon', 'zacian', 'zamazenta', 'eternatus'
  ];
  
  const words = message.toLowerCase().split(/\s+/);
  const foundPokemon: string[] = [];
  
  // Check for exact matches
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (pokemonKeywords.includes(cleanWord)) {
      foundPokemon.push(cleanWord);
    }
  });
  
  // Check for partial matches (at least 4 characters)
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (cleanWord.length >= 4) {
      pokemonKeywords.forEach(pokemon => {
        if (pokemon.includes(cleanWord) && !foundPokemon.includes(pokemon)) {
          foundPokemon.push(pokemon);
        }
      });
    }
  });
  
  return [...new Set(foundPokemon)];
}

/**
 * Extract Pokemon types from user messages
 */
export function extractPokemonTypes(message: string): string[] {
  const types = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting',
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
    'dragon', 'dark', 'steel', 'fairy'
  ];
  
  const words = message.toLowerCase().split(/\s+/);
  const foundTypes: string[] = [];
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (types.includes(cleanWord)) {
      foundTypes.push(cleanWord);
    }
  });
  
  return [...new Set(foundTypes)];
}

/**
 * Prefetch Pokemon data based on user message content
 */
export async function prefetchPokemonFromMessage(
  queryClient: QueryClient,
  message: string
): Promise<void> {
  const pokemonNames = extractPokemonNames(message);
  const pokemonTypes = extractPokemonTypes(message);
  
  // Prefetch individual Pokemon
  const prefetchPromises = pokemonNames.slice(0, 3).map(name => // Limit to 3 to avoid too many requests
    queryClient.prefetchQuery({
      queryKey: POKEMON_QUERY_KEYS.lookup(name),
      queryFn: () => pokemonService.fetchPokemon(name),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  );
  
  // Prefetch Pokemon by type
  const typePrefetchPromises = pokemonTypes.slice(0, 2).map(type => // Limit to 2 types
    queryClient.prefetchQuery({
      queryKey: POKEMON_QUERY_KEYS.byType(type),
      queryFn: () => pokemonService.getPokemonByType(type),
      staleTime: 10 * 60 * 1000, // 10 minutes
    })
  );
  
  // Check if user is asking for random Pokemon
  if (message.toLowerCase().includes('random')) {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: POKEMON_QUERY_KEYS.random(),
        queryFn: () => pokemonService.getRandomPokemon(),
        staleTime: 1 * 60 * 1000, // 1 minute for random
      })
    );
  }
  
  // Check if user is asking about team analysis
  if (message.toLowerCase().includes('team') || message.toLowerCase().includes('analyze')) {
    // Prefetch some popular Pokemon for team analysis
    const popularPokemon = ['pikachu', 'charizard', 'blastoise', 'venusaur'];
    popularPokemon.forEach(name => {
      prefetchPromises.push(
        queryClient.prefetchQuery({
          queryKey: POKEMON_QUERY_KEYS.lookup(name),
          queryFn: () => pokemonService.fetchPokemon(name),
          staleTime: 5 * 60 * 1000,
        })
      );
    });
  }
  
  try {
    await Promise.allSettled([...prefetchPromises, ...typePrefetchPromises]);
  } catch (error) {
    console.warn('Some prefetch operations failed:', error);
  }
}

/**
 * Check if Pokemon data is already cached
 */
export function isPokemonCached(queryClient: QueryClient, name: string): boolean {
  const data = queryClient.getQueryData(POKEMON_QUERY_KEYS.lookup(name));
  return data !== undefined;
}

/**
 * Get cached Pokemon data if available
 */
export function getCachedPokemon(queryClient: QueryClient, name: string) {
  return queryClient.getQueryData(POKEMON_QUERY_KEYS.lookup(name));
}