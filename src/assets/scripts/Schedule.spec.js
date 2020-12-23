import Schedule from './Schedule.js';

describe('Info: calcPer100k', () => {
  const _ = new Schedule(true);

  test('should be defined', () => {
    expect(_.transformMaxValue).toBeDefined();
  });

  test('Test for function transformMaxValue', () => {
    expect(_.transformMaxValue(1552)).toBeGreaterThan(1552);
    expect(_.transformMaxValue(0.1254)).toBe(1);
    expect(_.transformMaxValue(560)).toBe(1000);
  });
});
