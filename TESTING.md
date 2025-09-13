# Testing Setup

This project is configured with Jest for testing React Native/Expo applications.

## Available Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs tests when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (for continuous integration)
npm run test:ci

# Run specific test file
npm test -- path/to/test/file.test.ts
```

## Test Configuration

- **Jest Config**: `jest.config.js`
- **Setup File**: `jest.setup.js`
- **Test Environment**: Node.js with React Native preset
- **Coverage**: Configured to collect from `src/**/*.{ts,tsx}` files

## Writing Tests

### Basic Unit Tests
```typescript
describe('Component/Function Name', () => {
  test('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = someFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### React Native Component Tests
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  test('should render correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello World')).toBeTruthy();
  });

  test('should handle button press', () => {
    const mockFn = jest.fn();
    const { getByText } = render(<MyComponent onPress={mockFn} />);
    
    fireEvent.press(getByText('Press me'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Async Tests
```typescript
test('should handle async operations', async () => {
  const result = await someAsyncFunction();
  expect(result).toBeDefined();
});
```

## Mocking

Common mocks are already set up in `jest.setup.js`:
- AsyncStorage
- Expo Router
- React Native Reanimated
- Expo Constants

### Custom Mocks
```typescript
// Mock a module
jest.mock('./path/to/module', () => ({
  someFunction: jest.fn(() => 'mocked result'),
}));

// Mock a function
const mockFunction = jest.fn();
mockFunction.mockReturnValue('mocked value');
```

## Test Structure

- Place test files next to the components/functions they test
- Use `.test.ts` or `.spec.ts` extensions
- Group related tests in `__tests__` folders
- Follow the naming convention: `ComponentName.test.tsx`

## Coverage Reports

Coverage reports are generated in the `coverage/` directory when running `npm run test:coverage`. Open `coverage/lcov-report/index.html` in your browser to view detailed coverage information.