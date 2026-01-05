import { IAgeVerificationRepository } from '../../domain/repositories/IAgeVerificationRepository';
import { ICryptographicService } from '../../domain/services/ICryptographicService';
import { AgeVerificationService } from '../../domain/services/AgeVerificationService';
import { Age } from '../../domain/value-objects/Age';
import { ProofHash } from '../../domain/value-objects/ProofHash';
import { CreateAgeVerificationDTO } from '../dto/CreateAgeVerificationDTO';
import { AgeVerificationResponseDTO } from '../dto/AgeVerificationResponseDTO';

/**
 * Use Case: Create Age Verification
 * Orchestrates the creation of a new age verification proof
 */
export class CreateAgeVerificationUseCase {
  constructor(
    private readonly repository: IAgeVerificationRepository,
    private readonly cryptoService: ICryptographicService,
    private readonly domainService: AgeVerificationService,
  ) {}

  public async execute(dto: CreateAgeVerificationDTO): Promise<AgeVerificationResponseDTO> {
    // Create value objects
    const actualAge = new Age(dto.actualAge);
    const minimumAge = new Age(dto.minimumAge);

    // Validate age requirement
    if (!this.domainService.validateAgeRequirement(actualAge, minimumAge)) {
      throw new Error('Actual age does not meet minimum age requirement');
    }

    // Generate cryptographic proof
    const proofHash = await this.cryptoService.generateAgeProof(
      actualAge,
      minimumAge,
      dto.secret,
    );

    // Check if proof already exists
    const exists = await this.repository.exists(proofHash.getValue());
    if (exists) {
      throw new Error('Proof already exists');
    }

    // Generate secure ID
    const id = await this.cryptoService.generateSecureId();

    // Create verification entity
    const verification = this.domainService.createVerification(
      id,
      proofHash,
      minimumAge,
      dto.validityDurationMs,
    );

    // Save to repository
    await this.repository.save(verification);

    // Return DTO
    return this.toDTO(verification);
  }

  private toDTO(verification: any): AgeVerificationResponseDTO {
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
