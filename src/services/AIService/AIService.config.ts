export const AI_SERVICE_CONFIG = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 4096,
  systemPrompt: `You are a helpful AI assistant specialized in Pokémon knowledge. You have access to tools that can fetch Pokémon data and analyze teams. 
        
When users ask about Pokémon, use the available tools to provide accurate, up-to-date information. Be enthusiastic and knowledgeable about Pokémon, and help users discover new Pokémon, build teams, and learn about the Pokémon world.
        
Always provide detailed and engaging responses that make learning about Pokémon fun and interesting.`,
  streamConfig: {
    useNativeDriver: true,
  },
  errorMessages: {
    invalidApiKey: 'Invalid API key. Please check your Anthropic API key configuration.',
    rateLimitExceeded: 'Rate limit exceeded. Please wait a moment before trying again.',
    networkError: 'Network connection failed. Please check your internet connection.',
  },
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
  },
};

export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  RATE_LIMITED: 429,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;