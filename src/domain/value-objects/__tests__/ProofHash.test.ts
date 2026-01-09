import { ProofHash } from '../ProofHash';

describe('ProofHash Value Object', () => {
  const validHash = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

  describe('constructor', () => {
    it('should create a valid proof hash', () => {
      const proofHash = new ProofHash(validHash);
      expect(proofHash.getValue()).toBe(validHash);
    });

    it('should throw error for empty string', () => {
      expect(() => new ProofHash('')).toThrow('ProofHash must be a non-empty string');
    });

    it('should throw error for very short string', () => {
      expect(() => new ProofHash('short')).toThrow('ProofHash must be at least 10 characters long');
    });

    it('should accept non-hex base64 characters', () => {
      const base64Proto = 'eyJwaV9hIjpbIjM4MDQ5OTAwMzQ5NjE4NDMyN';
      expect(() => new ProofHash(base64Proto)).not.toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for equal hashes', () => {
      const hash1 = new ProofHash(validHash);
      const hash2 = new ProofHash(validHash);
      expect(hash1.equals(hash2)).toBe(true);
    });

    it('should return false for different hashes', () => {
      const hash1 = new ProofHash(validHash);
      const hash2 = new ProofHash(validHash.replace('0', '1'));
      expect(hash1.equals(hash2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation of hash', () => {
      const proofHash = new ProofHash(validHash);
      expect(proofHash.toString()).toBe(validHash);
    });
  });
});
