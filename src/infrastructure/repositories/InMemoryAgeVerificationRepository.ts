import { AgeVerification } from '../../domain/entities/AgeVerification.js';
import { IAgeVerificationRepository } from '../../domain/repositories/IAgeVerificationRepository.js';

/**
 * In-Memory Implementation of Age Verification Repository
 * For development and testing purposes
 */
export class InMemoryAgeVerificationRepository implements IAgeVerificationRepository {
  private readonly storage: Map<string, AgeVerification>;
  private readonly proofHashIndex: Map<string, string>; // proofHash -> id mapping

  constructor() {
    this.storage = new Map();
    this.proofHashIndex = new Map();
  }

  public async save(verification: AgeVerification): Promise<void> {
    this.storage.set(verification.getId(), verification);
    this.proofHashIndex.set(verification.getProofHash().getValue(), verification.getId());
  }

  public async findById(id: string): Promise<AgeVerification | null> {
    return this.storage.get(id) || null;
  }

  public async findByProofHash(proofHash: string): Promise<AgeVerification | null> {
    const id = this.proofHashIndex.get(proofHash);
    if (!id) {
      return null;
    }
    return this.findById(id);
  }

  public async update(verification: AgeVerification): Promise<void> {
    if (!this.storage.has(verification.getId())) {
      throw new Error('Verification not found');
    }
    this.storage.set(verification.getId(), verification);
  }

  public async delete(id: string): Promise<void> {
    const verification = this.storage.get(id);
    if (verification) {
      this.proofHashIndex.delete(verification.getProofHash().getValue());
      this.storage.delete(id);
    }
  }

  public async exists(proofHash: string): Promise<boolean> {
    return this.proofHashIndex.has(proofHash);
  }

  // Utility method for testing
  public clear(): void {
    this.storage.clear();
    this.proofHashIndex.clear();
  }
}
