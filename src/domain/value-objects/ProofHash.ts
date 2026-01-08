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
    // Basic hex string validation (assuming SHA-256 hash - 64 characters)
    const hexPattern = /^[0-9a-fA-F]{64}$/;
    if (!hexPattern.test(value)) {
      throw new Error('ProofHash must be a valid 64-character hexadecimal string');
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
