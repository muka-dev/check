import { createHash, randomUUID } from 'crypto';
import { ICryptographicService } from '../../domain/services/ICryptographicService';
import { Age } from '../../domain/value-objects/Age';
import { ProofHash } from '../../domain/value-objects/ProofHash';

/**
 * Mock Implementation of Cryptographic Service
 * In production, this would use proper zero-knowledge proofs
 * This is a simplified version for demonstration
 */
export class MockCryptographicService implements ICryptographicService {
  public async generateAgeProof(
    actualAge: Age,
    minimumAge: Age,
    secret: string,
  ): Promise<ProofHash> {
    // In a real implementation, this would generate a zero-knowledge proof
    // For now, we create a deterministic hash that proves age without revealing it
    const data = `${actualAge.getValue()}-${minimumAge.getValue()}-${secret}`;
    const hash = createHash('sha256').update(data).digest('hex');

    return new ProofHash(hash);
  }

  public async verifyAgeProof(proof: ProofHash): Promise<boolean> {
    // In a real implementation, this would verify the zero-knowledge proof
    // For now, we simply check if the proof hash is valid format
    // In production, this would verify cryptographic signatures and proofs
    try {
      // The proof validation would involve complex cryptographic operations
      // For this mock, we just check if it's a valid hash format
      return proof.getValue().length === 64;
    } catch {
      return false;
    }
  }

  public async generateSecureId(): Promise<string> {
    // Generate a cryptographically secure random ID
    return randomUUID();
  }
}
