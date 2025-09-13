export class APIError extends Error {
  public statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string = 'Operation'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof APIError || error instanceof NetworkError) {
      throw error;
    }
    
    console.error(`${context} failed:`, error);
    
    throw new APIError(
      `${context} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
}

export function logError(error: Error, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}] ` : '';
  
  console.error(`${timestamp} ${contextStr}${error.name}: ${error.message}`);
  
  if (error.stack) {
    console.error(error.stack);
  }
}