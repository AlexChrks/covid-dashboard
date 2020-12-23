import countPer100K from './countPer100KMap.js';

describe('Count cases per 100K', () => {

  test('should be defined', () => {
    expect(countPer100K).toBeDefined();
  });

  test('should return cases per 100K population', () => {
    expect(countPer100K(1, 1)).toBe(100000);
    expect(countPer100K(23, 10000)).toBe(230);
    expect(countPer100K(45, 1000000)).toBe(5);
  });
});