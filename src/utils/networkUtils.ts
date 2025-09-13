export interface NetworkUtilsInterface {
  fetchWithRetry(url: string, options?: RequestInit, maxRetries?: number): Promise<Response>;
}

export class NetworkUtils implements NetworkUtilsInterface {
  async fetchWithRetry(
    url: string, 
    options: RequestInit = {}, 
    maxRetries: number = 3
  ): Promise<Response> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });
        
        return response;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
}

export const networkUtils = new NetworkUtils();