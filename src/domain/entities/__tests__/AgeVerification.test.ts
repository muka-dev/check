import { AgeVerification } from '../AgeVerification';
import { Age } from '../../value-objects/Age';
import { ProofHash } from '../../value-objects/ProofHash';
import { Timestamp } from '../../value-objects/Timestamp';

describe('AgeVerification Entity', () => {
  const validHash = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  let verification: AgeVerification;

  beforeEach(() => {
    const proofHash = new ProofHash(validHash);
    const minimumAge = new Age(18);
    const timestamp = new Timestamp(new Date());
    const expiresAt = new Timestamp(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));

    verification = new AgeVerification('test-id', proofHash, minimumAge, timestamp, expiresAt);
  });

  describe('constructor', () => {
    it('should create a valid age verification', () => {
      expect(verification.getId()).toBe('test-id');
      expect(verification.getProofHash().getValue()).toBe(validHash);
      expect(verification.getMinimumAge().getValue()).toBe(18);
      expect(verification.isRevokedStatus()).toBe(false);
    });
  });

  describe('isValid', () => {
    it('should return true for non-expired, non-revoked verification', () => {
      expect(verification.isValid()).toBe(true);
    });

    it('should return false for revoked verification', () => {
      verification.revoke();
      expect(verification.isValid()).toBe(false);
    });

    it('should return false for expired verification', () => {
      const proofHash = new ProofHash(validHash);
      const minimumAge = new Age(18);
      const timestamp = new Timestamp(new Date());
      const expiresAt = new Timestamp(new Date(Date.now() - 1000)); // Expired

      const expiredVerification = new AgeVerification(
        'test-id',
        proofHash,
        minimumAge,
        timestamp,
        expiresAt,
      );

      expect(expiredVerification.isValid()).toBe(false);
    });
  });

  describe('revoke', () => {
    it('should mark verification as revoked', () => {
      verification.revoke();
      expect(verification.isRevokedStatus()).toBe(true);
      expect(verification.isValid()).toBe(false);
    });
  });
});
