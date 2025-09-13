import { useQuery, useQueryClient } from '@tanstack/react-query';
import { pokemonService } from '../services/PokemonService';
import { Pokemon } from '../services/PokemonService/types';

export const usePokemonLookup = (nameOrId: string | number, enabled = true) => {
  return useQuery({
    queryKey: ['pokemon', 'lookup', nameOrId],
    queryFn: () => pokemonService.fetchPokemon(nameOrId),
    enabled: enabled && !!nameOrId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useRandomPokemon = (enabled = true) => {
  return useQuery({
    queryKey: ['pokemon', 'random'],
    queryFn: () => {
      const randomId = Math.floor(Math.random() * 1010) + 1;
      return pokemonService.fetchPokemon(randomId);
    },
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const usePokemonSpecies = (nameOrId: string | number, enabled = true) => {
  return useQuery({
    queryKey: ['pokemon', 'species', nameOrId],
    queryFn: () => pokemonService.fetchPokemonSpecies(nameOrId),
    enabled: enabled && !!nameOrId,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

export const usePokemonType = (typeId: string | number, enabled = true) => {
  return useQuery({
    queryKey: ['pokemon', 'type', typeId],
    queryFn: () => pokemonService.fetchType(typeId),
    enabled: enabled && !!typeId,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

export const usePokemonAbility = (abilityName: string, enabled = true) => {
  return useQuery({
    queryKey: ['pokemon', 'ability', abilityName],
    queryFn: () => pokemonService.fetchAbility(abilityName),
    enabled: enabled && !!abilityName,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

export const usePokemonList = (limit = 100000, offset = 0, enabled = true) => {
  return useQuery({
    queryKey: ['pokemon', 'list', limit, offset],
    queryFn: () => pokemonService.fetchPokemonList(limit, offset),
    enabled,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

export const usePrefetchPokemon = () => {
  const queryClient = useQueryClient();
  
  const prefetchPokemon = async (nameOrId: string | number) => {
    await queryClient.prefetchQuery({
      queryKey: ['pokemon', 'lookup', nameOrId],
      queryFn: () => pokemonService.fetchPokemon(nameOrId),
      staleTime: 10 * 60 * 1000,
    });
  };
  
  const prefetchRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 1010) + 1;
    await queryClient.prefetchQuery({
      queryKey: ['pokemon', 'random'],
      queryFn: () => pokemonService.fetchPokemon(randomId),
      staleTime: 2 * 60 * 1000,
    });
  };
  
  return {
    prefetchPokemon,
    prefetchRandomPokemon,
  };
};

export const useCachedPokemon = (nameOrId: string | number): Pokemon | undefined => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(['pokemon', 'lookup', nameOrId]);
};