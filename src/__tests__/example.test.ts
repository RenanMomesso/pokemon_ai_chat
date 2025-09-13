// Example test file to demonstrate Jest is working

describe('Example Tests', () => {
  test('should add two numbers correctly', () => {
    const result = 2 + 3;
    expect(result).toBe(5);
  });

  test('should handle string concatenation', () => {
    const greeting = 'Hello' + ' ' + 'World';
    expect(greeting).toBe('Hello World');
  });

  test('should work with arrays', () => {
    const fruits = ['apple', 'banana', 'orange'];
    expect(fruits).toHaveLength(3);
    expect(fruits).toContain('banana');
  });

  test('should work with objects', () => {
    const user = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com'
    };
    
    expect(user).toHaveProperty('name', 'John Doe');
    expect(user.age).toBeGreaterThan(18);
  });

  test('should handle async operations', async () => {
    const promise = Promise.resolve('success');
    const result = await promise;
    expect(result).toBe('success');
  });
});