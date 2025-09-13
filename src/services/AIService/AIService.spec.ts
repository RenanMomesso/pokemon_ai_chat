import { AIService } from './AIService';
import { Message, Tool } from '../../types';
import { APIError, NetworkError } from '../../utils/errorHandler';

// Mock Anthropic SDK
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

// Mock environment variables
jest.mock('@env', () => ({
  ANTHROPIC_API_KEY: 'test-api-key',
}));

// Mock utils
jest.mock('../../utils/errorHandler', () => ({
  APIError: jest.fn(),
  NetworkError: jest.fn(),
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
    aiService = new AIService();
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

      mockAnthropic.mockImplementation(() => ({
        messages: {
          create: jest.fn().mockResolvedValue(mockResponse),
        },
      }));

      aiService = new AIService();
      const result = await aiService.generateResponse(mockMessages);
      
      expect(result).toBe('Test response');
    });

    it('should handle API errors', async () => {
      const error = new Error('401 Unauthorized');
      
      mockAnthropic.mockImplementation(() => ({
        messages: {
          create: jest.fn().mockRejectedValue(error),
        },
      }));

      aiService = new AIService();
      
      await expect(aiService.generateResponse(mockMessages)).rejects.toThrow();
    });

    it('should handle rate limit errors', async () => {
      const error = new Error('429 Rate Limited');
      
      mockAnthropic.mockImplementation(() => ({
        messages: {
          create: jest.fn().mockRejectedValue(error),
        },
      }));

      aiService = new AIService();
      
      await expect(aiService.generateResponse(mockMessages)).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      const error = new Error('network error');
      
      mockAnthropic.mockImplementation(() => ({
        messages: {
          create: jest.fn().mockRejectedValue(error),
        },
      }));

      aiService = new AIService();
      
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

      const converted = aiService['convertMessagesToAnthropic'](messagesWithSystem);
      expect(converted).toHaveLength(2);
      expect(converted.every(msg => msg.role !== 'system')).toBe(true);
    });

    it('should convert tools to Anthropic format', () => {
      aiService.registerTool(mockTool);
      const converted = aiService['convertToolsToAnthropic']();
      
      expect(converted).toHaveLength(1);
      expect(converted[0]).toEqual({
        name: mockTool.name,
        description: mockTool.description,
        input_schema: mockTool.parameters,
      });
    });
  });
});