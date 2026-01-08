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

    it('should throw error for invalid hex string', () => {
      expect(() => new ProofHash('not-a-hex-string')).toThrow(
        'ProofHash must be a valid 64-character hexadecimal string',
      );
    });

    it('should throw error for incorrect length', () => {
      expect(() => new ProofHash('0123456789abcdef')).toThrow(
        'ProofHash must be a valid 64-character hexadecimal string',
      );
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
