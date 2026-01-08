import { Age } from '../value-objects/Age';
import { ProofHash } from '../value-objects/ProofHash';
import { Timestamp } from '../value-objects/Timestamp';

/**
 * AgeVerification Entity
 * Represents a decentralized, anonymous age verification
 */
export class AgeVerification {
  private readonly id: string;
  private readonly proofHash: ProofHash;
  private readonly minimumAge: Age;
  private readonly timestamp: Timestamp;
  private readonly expiresAt: Timestamp;
  private isRevoked: boolean;

  constructor(
    id: string,
    proofHash: ProofHash,
    minimumAge: Age,
    timestamp: Timestamp,
    expiresAt: Timestamp,
  ) {
    this.id = id;
    this.proofHash = proofHash;
    this.minimumAge = minimumAge;
    this.timestamp = timestamp;
    this.expiresAt = expiresAt;
    this.isRevoked = false;
  }

  public getId(): string {
    return this.id;
  }

  public getProofHash(): ProofHash {
    return this.proofHash;
  }

  public getMinimumAge(): Age {
    return this.minimumAge;
  }

  public getTimestamp(): Timestamp {
    return this.timestamp;
  }

  public getExpiresAt(): Timestamp {
    return this.expiresAt;
  }

  public isValid(): boolean {
    if (this.isRevoked) {
      return false;
    }

    const now = new Timestamp(new Date());
    return now.isBefore(this.expiresAt);
  }

  public revoke(): void {
    this.isRevoked = true;
  }

  public isRevokedStatus(): boolean {
    return this.isRevoked;
  }
}
