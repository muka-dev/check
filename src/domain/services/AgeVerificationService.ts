import { AgeVerification } from '../entities/AgeVerification.js';
import { Age } from '../value-objects/Age.js';
import { ProofHash } from '../value-objects/ProofHash.js';
import { Timestamp } from '../value-objects/Timestamp.js';

/**
 * Domain Service for Age Verification Operations
 * Contains business logic that doesn't naturally fit in an entity
 */
export class AgeVerificationService {
  /**
   * Validate that an age meets the minimum requirement
   */
  public validateAgeRequirement(actualAge: Age, minimumAge: Age): boolean {
    return actualAge.getValue() >= minimumAge.getValue();
  }

  /**
   * Create a new age verification with proper expiration
   */
  public createVerification(
    id: string,
    proofHash: ProofHash,
    minimumAge: Age,
    validityDurationMs: number = 90 * 24 * 60 * 60 * 1000, // 90 days default
  ): AgeVerification {
    const now = new Timestamp(new Date());
    const expiresAt = new Timestamp(new Date(Date.now() + validityDurationMs));

    return new AgeVerification(id, proofHash, minimumAge, now, expiresAt);
  }

  /**
   * Check if a verification can be trusted
   */
  public canTrust(verification: AgeVerification): boolean {
    // Verification must be valid (not expired and not revoked)
    if (!verification.isValid()) {
      return false;
    }

    // Additional trust checks can be added here
    // For example: check if verification is from a trusted issuer
    // or if it meets additional requirements

    return true;
  }
}
