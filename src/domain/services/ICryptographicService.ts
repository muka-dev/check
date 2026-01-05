import { Age } from '../value-objects/Age';
import { ProofHash } from '../value-objects/ProofHash';

/**
 * Service interface for cryptographic proof generation
 * Interface in domain, implementation in infrastructure
 */
export interface ICryptographicService {
  /**
   * Generate a zero-knowledge proof that an age meets minimum requirement
   * without revealing the actual age
   */
  generateAgeProof(actualAge: Age, minimumAge: Age, secret: string): Promise<ProofHash>;

  /**
   * Verify a proof without knowing the actual age
   */
  verifyAgeProof(proof: ProofHash, minimumAge: Age): Promise<boolean>;

  /**
   * Generate a secure random identifier
   */
  generateSecureId(): Promise<string>;
}
