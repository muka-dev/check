import { IAgeVerificationRepository } from '../../domain/repositories/IAgeVerificationRepository.js';
import { ICryptographicService } from '../../domain/services/ICryptographicService.js';
import { IBlockchainRegistry } from '../../domain/services/IBlockchainRegistry.js';
import { AgeVerificationService } from '../../domain/services/AgeVerificationService.js';
import { Age } from '../../domain/value-objects/Age.js';
import { ProofHash } from '../../domain/value-objects/ProofHash.js';
import { IVerifyProofDTO } from '../dto/VerifyProofDTO.js';

/**
 * Use Case: Verify Age Proof
 * Verifies that a proof is valid and trustworthy
 */
export class VerifyAgeProofUseCase {
  constructor(
    private readonly repository: IAgeVerificationRepository,
    private readonly cryptoService: ICryptographicService,
    private readonly domainService: AgeVerificationService,
    private readonly blockchainRegistry?: IBlockchainRegistry,
  ) {}

  public async execute(dto: IVerifyProofDTO): Promise<boolean> {
    // Create value objects
    const proofHash = new ProofHash(dto.proofHash);
    const minimumAge = new Age(dto.minimumAge);

    // Verify cryptographic proof
    const isCryptographicallyValid = await this.cryptoService.verifyAgeProof(proofHash, minimumAge);

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
    const isTrusted = this.domainService.canTrust(verification);

    if (isTrusted && this.blockchainRegistry) {
      try {
        // In a real implementation, we would extract the full proof signals from the DTO or Repo
        // For now, we simulate the signals needed for the contract
        // a, b, c, publicSignals
        // This is a placeholder as the current DTO doesn't carry the raw ZK Proof data, just the hash
        // In fully implemented ZK, the execute() would receive the full proof to forward to chain.
        /*
          await this.blockchainRegistry.verifyAndRegister(
             ... extract proof data ...
          );
        */
        // console.log('Blockchain registration skipped (Proof data absent in DTO)');
      } catch (error) {
        // Don't fail the API request if blockchain fails, but log it
        // eslint-disable-next-line no-console
        console.error('Failed to register on blockchain:', error);
      }
    }

    return isTrusted;
  }
}
