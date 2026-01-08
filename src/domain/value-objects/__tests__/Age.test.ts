import { Age } from '../Age';

describe('Age Value Object', () => {
  describe('constructor', () => {
    it('should create a valid age', () => {
      const age = new Age(25);
      expect(age.getValue()).toBe(25);
    });

    it('should throw error for negative age', () => {
      expect(() => new Age(-1)).toThrow('Age cannot be negative');
    });

    it('should throw error for non-integer age', () => {
      expect(() => new Age(25.5)).toThrow('Age must be an integer');
    });

    it('should throw error for age exceeding 150', () => {
      expect(() => new Age(151)).toThrow('Age cannot exceed 150 years');
    });
  });

  describe('isAdult', () => {
    it('should return true for age 18 or above with default legal age', () => {
      const age = new Age(18);
      expect(age.isAdult()).toBe(true);
    });

    it('should return false for age below 18 with default legal age', () => {
      const age = new Age(17);
      expect(age.isAdult()).toBe(false);
    });

    it('should respect custom legal age', () => {
      const age = new Age(20);
      expect(age.isAdult(21)).toBe(false);
      expect(age.isAdult(20)).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for equal ages', () => {
      const age1 = new Age(25);
      const age2 = new Age(25);
      expect(age1.equals(age2)).toBe(true);
    });

    it('should return false for different ages', () => {
      const age1 = new Age(25);
      const age2 = new Age(26);
      expect(age1.equals(age2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation of age', () => {
      const age = new Age(25);
      expect(age.toString()).toBe('25');
    });
  });
});
