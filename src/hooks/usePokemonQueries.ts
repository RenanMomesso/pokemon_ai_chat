import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pokemonService } from '../services/PokemonService';
import { Pokemon, PokemonSpecies, TeamAnalysis } from '../types';
import { PokemonLookupParams, RandomPokemonParams, TeamAnalysisParams } from '../tools/types';

// Query keys for consistent caching
export const pokemonQueryKeys = {
  all: ['pokemon'] as const,
  pokemon: (params: PokemonLookupParams) => ['pokemon', 'lookup', params] as const,
  random: (params: RandomPokemonParams) => ['pokemon', 'random', params] as const,
  species: (name: string) => ['pokemon', 'species', name] as const,
  teamAnalysis: (params: TeamAnalysisParams) => ['pokemon', 'team-analysis', params] as const,
};

// Hook for searching/looking up a specific Pokemon
export const usePokemonLookup = (params: PokemonLookupParams, enabled = true) => {
  return useQuery({
    queryKey: pokemonQueryKeys.pokemon(params),
    queryFn: () => pokemonService.searchPokemon(params),
    enabled: enabled && !!params.name,
    staleTime: 10 * 60 * 1000, // 10 minutes - Pokemon data rarely changes
    gcTime: 30 * 60 * 1000, // 30 minutes in cache
  });
};

// Hook for getting a random Pokemon
export const useRandomPokemon = (params: RandomPokemonParams = {}, enabled = true) => {
  return useQuery({
    queryKey: pokemonQueryKeys.random(params),
    queryFn: () => pokemonService.getRandomPokemon(params),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes - random Pokemon can be refreshed more often
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
  });
};

// Hook for getting Pokemon species information
export const usePokemonSpecies = (name: string, enabled = true) => {
  return useQuery({
    queryKey: pokemonQueryKeys.species(name),
    queryFn: () => pokemonService.getPokemonSpecies(name),
    enabled: enabled && !!name,
    staleTime: 15 * 60 * 1000, // 15 minutes - species data is very stable
    gcTime: 60 * 60 * 1000, // 1 hour in cache
  });
};

// Hook for team analysis
export const useTeamAnalysis = (params: TeamAnalysisParams, enabled = true) => {
  return useQuery({
    queryKey: pokemonQueryKeys.teamAnalysis(params),
    queryFn: () => pokemonService.analyzeTeam(params),
    enabled: enabled && params.team && params.team.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes in cache
  });
};

// Mutation hook for actions that modify data (if needed in the future)
export const usePokemonMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Placeholder for future mutations like saving favorite Pokemon
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch Pokemon queries
      queryClient.invalidateQueries({ queryKey: pokemonQueryKeys.all });
    },
  });
};

// Utility hook to prefetch Pokemon data
export const usePrefetchPokemon = () => {
  const queryClient = useQueryClient();
  
  const prefetchPokemon = async (name: string) => {
    await queryClient.prefetchQuery({
      queryKey: pokemonQueryKeys.pokemon({ name }),
      queryFn: () => pokemonService.searchPokemon({ name }),
      staleTime: 10 * 60 * 1000,
    });
  };
  
  const prefetchRandomPokemon = async () => {
    await queryClient.prefetchQuery({
      queryKey: pokemonQueryKeys.random({}),
      queryFn: () => pokemonService.getRandomPokemon({}),
      staleTime: 2 * 60 * 1000,
    });
  };
  
  return {
    prefetchPokemon,
    prefetchRandomPokemon,
  };
};

// Hook to get cached Pokemon data without triggering a request
export const useCachedPokemon = (name: string): Pokemon | undefined => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(pokemonQueryKeys.pokemon({ name }));
};