import { IAgeVerificationRepository } from '../../domain/repositories/IAgeVerificationRepository.js';
import { ICryptographicService } from '../../domain/services/ICryptographicService.js';
import { AgeVerificationService } from '../../domain/services/AgeVerificationService.js';
import { Age } from '../../domain/value-objects/Age.js';
import { ICreateAgeVerificationDTO } from '../dto/CreateAgeVerificationDTO.js';
import { IAgeVerificationResponseDTO } from '../dto/AgeVerificationResponseDTO.js';
import { AgeVerification } from '../../domain/entities/AgeVerification.js';
import { IUseCase } from './IUseCase.js';

/**
 * Use Case: Create Age Verification
 * Orchestrates the creation of a new age verification proof
 */
export class CreateAgeVerificationUseCase implements IUseCase {
  constructor(
    private readonly repository: IAgeVerificationRepository,
    private readonly cryptoService: ICryptographicService,
    private readonly domainService: AgeVerificationService,
  ) {}

  public async execute(dto?: ICreateAgeVerificationDTO): Promise<IAgeVerificationResponseDTO> {
    if (!dto) {
      throw new Error('No valid dto found');
    }
    return this.executeImpl(dto);
  }

  private async executeImpl(dto: ICreateAgeVerificationDTO): Promise<IAgeVerificationResponseDTO> {
    // Create value objects
    const actualAge = new Age(dto.actualAge);
    const minimumAge = new Age(dto.minimumAge);

    // Validate age requirement
    if (!this.domainService.validateAgeRequirement(actualAge, minimumAge)) {
      throw new Error('Actual age does not meet minimum age requirement');
    }

    // Generate cryptographic proof
    const proofHash = await this.cryptoService.generateAgeProof(actualAge, minimumAge, dto.secret);

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

  private toDTO(verification: AgeVerification): IAgeVerificationResponseDTO {
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
