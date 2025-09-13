import { Message, Tool } from '../../types';
import { AIService } from './AIService';

jest.mock('@anthropic-ai/sdk', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn(),
      },
    })),
  };
});



jest.mock('expo/fetch', () => ({
  fetch: jest.fn(),
}));

jest.mock('../../utils/errorHandler', () => ({
  APIError: jest.fn().mockImplementation((message, code) => {
    const error = new Error(message);
    error.name = 'APIError';
    error.code = code;
    return error;
  }),
  NetworkError: jest.fn().mockImplementation((message) => {
    const error = new Error(message);
    error.name = 'NetworkError';
    return error;
  }),
  withErrorHandling: jest.fn((fn) => fn()),
  handleError: jest.fn((error) => error.message),
}));

jest.mock('../../utils/networkUtils', () => ({
  networkUtils: {
    fetchWithRetry: jest.fn(),
  },
}));

const mockTool: Tool = {
  name: 'test_tool',
  description: 'A test tool',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string' },
    },
  },
  handler: jest.fn(),
};

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello',
    role: 'user',
    timestamp: new Date(),
    isStreaming: false,
  },
  {
    id: '2',
    content: 'Hi there!',
    role: 'assistant',
    timestamp: new Date(),
    isStreaming: false,
  },
];

describe('AIService', () => {
  let aiService: AIService;
  let mockAnthropic: any;

  beforeEach(() => {
    jest.clearAllMocks();
    aiService = new AIService('test-api-key');
    mockAnthropic = require('@anthropic-ai/sdk').default;
  });

  describe('Tool Management', () => {
    it('should register a single tool', () => {
      aiService.registerTool(mockTool);
      expect(aiService['tools']).toContain(mockTool);
    });

    it('should register multiple tools', () => {
      const tools = [mockTool, { ...mockTool, name: 'tool2' }];
      aiService.registerTools(tools);
      expect(aiService['tools']).toHaveLength(2);
    });
  });

  describe('generateResponse', () => {
    it('should generate a response successfully', async () => {
      const mockResponse = {
        content: [
          { type: 'text', text: 'Test response' },
        ],
      };

      const mockFetch = require('expo/fetch').fetch;
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      aiService = new AIService('test-api-key');
      const result = await aiService.generateResponse(mockMessages);
      
      expect(result).toBe('Test response');
    });

    it('should handle API errors', async () => {
      const mockFetch = require('expo/fetch').fetch;
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      aiService = new AIService('test-api-key');
      
      await expect(aiService.generateResponse(mockMessages)).rejects.toThrow();
    });

    it('should handle rate limit errors', async () => {
      const mockFetch = require('expo/fetch').fetch;
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Rate Limited',
        json: jest.fn().mockResolvedValue({})
      });

      aiService = new AIService('test-api-key');
      
      await expect(aiService.generateResponse(mockMessages)).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      const mockFetch = require('expo/fetch').fetch;
      mockFetch.mockRejectedValue(new Error('fetch failed: network error'));

      aiService = new AIService('test-api-key');
      
      await expect(aiService.generateResponse(mockMessages)).rejects.toThrow();
    });
  });

  describe('Message Conversion', () => {
    it('should filter out system messages', () => {
      const messagesWithSystem: Message[] = [
        ...mockMessages,
        {
          id: '3',
          content: 'System message',
          role: 'system',
          timestamp: new Date(),
          isStreaming: false,
        },
      ];

      const converted = aiService['convertMessagesToAPI'](messagesWithSystem);
      expect(converted).toHaveLength(2);
      expect(converted.every(msg => msg.role !== 'system')).toBe(true);
    });

    it('should convert tools to Anthropic format', () => {
      aiService.registerTool(mockTool);
      const converted = aiService['convertToolsToAPI']();
      
      expect(converted).toHaveLength(1);
      expect(converted[0]).toEqual({
        name: mockTool.name,
        description: mockTool.description,
        input_schema: mockTool.parameters,
      });
    });
  });
});