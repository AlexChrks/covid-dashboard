import Info from './Info.js';

describe('Info: calcPer100k', () => {
  const info = new Info(null);

  test('Info.calcPer100k should be defined', () => {
    expect(Info.calcPer100k).toBeDefined();
  });

  test('Test for function Info.calcPer100k', () => {
    expect(Info.calcPer100k(5, 10, 1)).toBe(5);
    expect(Info.calcPer100k(2000, 200000, 100000)).toBe(1000);
    expect(Info.calcPer100k(2, 200000, 100000)).toBe(1);
    expect(Info.calcPer100k(1, 200000, 100000)).toBe(0.5);
  });
});
