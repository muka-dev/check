/**
 * ProofHash Value Object
 * Represents a cryptographic proof hash for anonymous verification
 */
export class ProofHash {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new Error('ProofHash must be a non-empty string');
    }

    // Validation relaxed to support:
    // 1. SHA-256 Hex strings (64 chars) - Used in Mocks
    // 2. Base64 encoded ZK Proofs (longer) - Used in Production
    // 3. Simulation strings (prefixed with sim_) - Used in dev fallback
    if (value.length < 10) {
      throw new Error('ProofHash must be at least 10 characters long');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ProofHash): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
