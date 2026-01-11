import { AgeVerification } from '../entities/AgeVerification.js';

/**
 * Repository interface for AgeVerification persistence
 * Following Repository pattern - interface in domain, implementation in infrastructure
 */
export interface IAgeVerificationRepository {
  /**
   * Save a new age verification
   */
  save(verification: AgeVerification): Promise<void>;

  /**
   * Find an age verification by ID
   */
  findById(id: string): Promise<AgeVerification | null>;

  /**
   * Find an age verification by proof hash
   */
  findByProofHash(proofHash: string): Promise<AgeVerification | null>;

  /**
   * Update an existing age verification
   */
  update(verification: AgeVerification): Promise<void>;

  /**
   * Delete an age verification
   */
  delete(id: string): Promise<void>;

  /**
   * Check if a proof hash exists
   */
  exists(proofHash: string): Promise<boolean>;
}
