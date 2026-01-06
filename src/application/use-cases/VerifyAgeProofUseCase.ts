import { IAgeVerificationRepository } from '../../domain/repositories/IAgeVerificationRepository';
import { ICryptographicService } from '../../domain/services/ICryptographicService';
import { AgeVerificationService } from '../../domain/services/AgeVerificationService';
import { Age } from '../../domain/value-objects/Age';
import { ProofHash } from '../../domain/value-objects/ProofHash';
import { IVerifyProofDTO } from '../dto/VerifyProofDTO';

/**
 * Use Case: Verify Age Proof
 * Verifies that a proof is valid and trustworthy
 */
export class VerifyAgeProofUseCase {
  constructor(
    private readonly repository: IAgeVerificationRepository,
    private readonly cryptoService: ICryptographicService,
    private readonly domainService: AgeVerificationService,
  ) {}

  public async execute(dto: IVerifyProofDTO): Promise<boolean> {
    // Create value objects
    const proofHash = new ProofHash(dto.proofHash);
    const minimumAge = new Age(dto.minimumAge);

    // Verify cryptographic proof
    const isCryptographicallyValid = await this.cryptoService.verifyAgeProof(proofHash);

    if (!isCryptographicallyValid) {
      return false;
    }

    // Find verification in repository
    const verification = await this.repository.findByProofHash(proofHash.getValue());

    if (!verification) {
      return false;
    }

    // Check if verification meets minimum age requirement
    if (verification.getMinimumAge().getValue() < minimumAge.getValue()) {
      return false;
    }

    // Check if verification can be trusted (valid and not revoked)
    return this.domainService.canTrust(verification);
  }
}
