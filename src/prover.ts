/**
 * Proof Generator - Creates zero-knowledge proofs for age verification
 */

import {
  AgeCredential,
  AgeProof,
  ProofRequest,
} from './types';
import {
  generateBlindingFactor,
  generateCommitment,
  createAgeProof,
} from './crypto';

/**
 * ProofGenerator class for creating zero-knowledge age proofs
 */
export class ProofGenerator {
  /**
   * Generate a zero-knowledge proof that the credential holder is over a minimum age
   * @param request - The proof request containing credential and minimum age
   * @returns An age proof that can be verified without revealing the date of birth
   */
  generateProof(request: ProofRequest): AgeProof {
    this.validateRequest(request);

    const { credential, minimumAge, verificationDate = new Date() } = request;

    // Check if credential has expired
    if (credential.expiresAt && credential.expiresAt.getTime() < verificationDate.getTime()) {
      throw new Error('Credential has expired');
    }

    // Calculate actual age
    const ageInMs = verificationDate.getTime() - credential.dateOfBirth.getTime();
    const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);

    // Verify that the user actually meets the minimum age requirement
    if (ageInYears < minimumAge) {
      throw new Error(`User does not meet minimum age requirement of ${minimumAge}`);
    }

    // Generate a blinding factor for the commitment
    const blindingFactor = generateBlindingFactor();

    // Create a commitment to the credential (hiding the date of birth)
    const credentialCommitment = generateCommitment(
      credential.dateOfBirth.toISOString(),
      blindingFactor
    );

    // Generate the zero-knowledge proof
    const proofData = createAgeProof(
      credential.dateOfBirth,
      minimumAge,
      verificationDate,
      credential.issuerSignature,
      blindingFactor
    );

    const proof: AgeProof = {
      minimumAge,
      proof: proofData,
      publicInputs: {
        credentialCommitment,
        verificationDate: verificationDate.toISOString(),
        issuerPublicKey: credential.issuerPublicKey,
      },
      generatedAt: new Date(),
    };

    return proof;
  }

  /**
   * Validate a proof request
   */
  private validateRequest(request: ProofRequest): void {
    if (!request.credential) {
      throw new Error('Credential is required');
    }

    if (typeof request.minimumAge !== 'number' || request.minimumAge < 0) {
      throw new Error('Valid minimum age is required');
    }

    if (request.minimumAge > 150) {
      throw new Error('Minimum age cannot exceed 150');
    }

    if (!request.credential.dateOfBirth || !(request.credential.dateOfBirth instanceof Date)) {
      throw new Error('Invalid credential: date of birth must be a Date object');
    }

    if (!request.credential.issuerSignature || !request.credential.issuerPublicKey) {
      throw new Error('Invalid credential: missing signature or issuer public key');
    }

    const verificationDate = request.verificationDate || new Date();
    if (verificationDate.getTime() < request.credential.dateOfBirth.getTime()) {
      throw new Error('Verification date cannot be before date of birth');
    }
  }
}
