import { IAgeVerificationRepository } from '../../domain/repositories/IAgeVerificationRepository';
import { AgeVerificationResponseDTO } from '../dto/AgeVerificationResponseDTO';

/**
 * Use Case: Get Age Verification by ID
 * Retrieves an age verification by its ID
 */
export class GetAgeVerificationUseCase {
  constructor(private readonly repository: IAgeVerificationRepository) {}

  public async execute(id: string): Promise<AgeVerificationResponseDTO | null> {
    const verification = await this.repository.findById(id);

    if (!verification) {
      return null;
    }

    return {
      id: verification.getId(),
      proofHash: verification.getProofHash().getValue(),
      minimumAge: verification.getMinimumAge().getValue(),
      timestamp: verification.getTimestamp().toString(),
      expiresAt: verification.getExpiresAt().toString(),
      isValid: verification.isValid(),
      isRevoked: verification.isRevokedStatus(),
    };
  }
}
