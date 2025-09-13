# TanStack Query Integration

This project uses TanStack Query (formerly React Query) for efficient data caching, synchronization, and offline-first functionality.

## Overview

TanStack Query provides:
- **Automatic caching** with configurable stale times
- **Background refetching** to keep data fresh
- **Offline support** with cached data fallbacks
- **Request deduplication** to avoid duplicate API calls
- **Optimistic updates** for better UX
- **DevTools** for debugging queries

## Configuration

### QueryClient Setup
The QueryClient is configured in `src/providers/QueryProvider.tsx` with mobile-optimized settings:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      gcTime: 10 * 60 * 1000,         // 10 minutes
      retry: 2,                        // Retry failed requests 2 times
      refetchOnWindowFocus: false,     // Don't refetch on app focus
      refetchOnReconnect: true,        // Refetch when network reconnects
    },
  },
});
```

### Provider Integration
The app is wrapped with QueryProvider in `app/_layout.tsx`:

```typescript
export default function RootLayout() {
  return (
    <QueryProvider>
      <ChatProvider>
        <Stack />
      </ChatProvider>
    </QueryProvider>
  );
}
```

## Pokemon Data Queries

### Available Hooks
All Pokemon-related queries are defined in `src/hooks/usePokemonQueries.ts`:

#### Individual Pokemon Lookup
```typescript
const { data: pokemon, isLoading, error } = usePokemonLookup('pikachu');
```

#### Random Pokemon
```typescript
const { data: randomPokemon, refetch } = useRandomPokemon();
```

#### Pokemon by Type
```typescript
const { data: firePokemon } = usePokemonByType('fire');
```

#### Pokemon Search
```typescript
const { data: searchResults } = usePokemonSearch('pika', 10);
```

#### Team Analysis
```typescript
const { data: analysis } = useTeamAnalysis(['pikachu', 'charizard', 'blastoise']);
```

### Mutations
For data modifications:

```typescript
const addToFavorites = usePokemonMutation();

addToFavorites.mutate(
  { action: 'addFavorite', pokemonId: 'pikachu' },
  {
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['pokemon', 'favorites'] });
    },
  }
);
```

## Chat Integration

### Message Caching
Chat messages are cached using TanStack Query in `ChatContext.tsx`:

```typescript
// Save to both AsyncStorage and query cache
queryClient.setQueryData(['chat', 'messages'], messages);

// Load from cache first, fallback to AsyncStorage
const cachedMessages = queryClient.getQueryData<Message[]>(['chat', 'messages']);
```

### Smart Prefetching
The system automatically prefetches Pokemon data based on user messages:

```typescript
// Analyzes user input and prefetches relevant Pokemon data
await prefetchPokemonFromMessage(queryClient, userMessage);
```

## Prefetching Strategies

### Automatic Prefetching
The `pokemonPrefetch.ts` utility provides intelligent prefetching:

1. **Pokemon Name Detection**: Extracts Pokemon names from user messages
2. **Type Detection**: Identifies Pokemon types mentioned
3. **Context Awareness**: Prefetches based on conversation context
4. **Popular Pokemon**: Preloads commonly requested Pokemon

### Manual Prefetching
```typescript
const prefetchPokemon = usePrefetchPokemon();

// Prefetch specific Pokemon
await prefetchPokemon('charizard');

// Prefetch multiple Pokemon
await Promise.all([
  prefetchPokemon('pikachu'),
  prefetchPokemon('blastoise'),
  prefetchPokemon('venusaur')
]);
```

## Offline Support

### Cached Data Access
```typescript
// Check if data is cached
const isCached = isPokemonCached(queryClient, 'pikachu');

// Get cached data directly
const cachedPokemon = getCachedPokemon(queryClient, 'pikachu');
```

### Offline Behavior
- Queries return cached data when offline
- Failed requests are retried when connection is restored
- Background refetching resumes on reconnection
- Mutations are queued and executed when online

## Query Keys Structure

```typescript
const POKEMON_QUERY_KEYS = {
  all: ['pokemon'] as const,
  lookup: (nameOrId: string) => ['pokemon', 'lookup', nameOrId] as const,
  search: (query: string, limit: number) => ['pokemon', 'search', query, limit] as const,
  byType: (type: string) => ['pokemon', 'type', type] as const,
  random: () => ['pokemon', 'random', Date.now()] as const,
  team: (pokemonNames: string[]) => ['pokemon', 'team', ...pokemonNames.sort()] as const,
  species: (nameOrId: string) => ['pokemon', 'species', nameOrId] as const,
};
```

## Performance Optimizations

### Stale-While-Revalidate
- Data is served from cache immediately (if available)
- Background refetch updates the cache
- UI stays responsive with instant data

### Request Deduplication
- Multiple components requesting the same data share a single request
- Prevents unnecessary API calls
- Reduces bandwidth usage

### Garbage Collection
- Unused queries are automatically cleaned up
- Configurable garbage collection time (gcTime)
- Memory usage is optimized

## DevTools

In development, React Query DevTools are available:
- View all active queries
- Inspect query states and data
- Manually trigger refetches
- Debug cache behavior

## Best Practices

### 1. Use Appropriate Stale Times
```typescript
// Static data (Pokemon info) - longer stale time
staleTime: 10 * 60 * 1000, // 10 minutes

// Dynamic data (user preferences) - shorter stale time
staleTime: 1 * 60 * 1000,  // 1 minute
```

### 2. Invalidate Related Queries
```typescript
// After updating favorites, invalidate related queries
queryClient.invalidateQueries({ queryKey: ['pokemon', 'favorites'] });
queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
```

### 3. Handle Loading States
```typescript
const { data, isLoading, error, isFetching } = usePokemonLookup('pikachu');

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (isFetching) return <DataWithRefreshIndicator data={data} />;
```

### 4. Optimize Re-renders
```typescript
// Use select to transform data and prevent unnecessary re-renders
const pokemonName = usePokemonLookup('pikachu', {
  select: (data) => data?.name,
});
```

## Troubleshooting

### Common Issues

1. **Stale Data**: Adjust `staleTime` or manually invalidate queries
2. **Memory Usage**: Reduce `gcTime` or limit concurrent queries
3. **Network Errors**: Implement proper error boundaries and retry logic
4. **Cache Misses**: Verify query keys are consistent

### Debugging

1. Enable DevTools in development
2. Use `queryClient.getQueryCache()` to inspect cache
3. Log query states for debugging
4. Monitor network requests in browser DevTools

## Migration Notes

When migrating existing code to use TanStack Query:

1. Replace direct service calls with query hooks
2. Remove manual loading states (handled by queries)
3. Update error handling to use query error states
4. Implement proper cache invalidation
5. Add prefetching for better UX

This integration provides a robust, offline-first data layer that significantly improves the user experience through intelligent caching and prefetching strategies.