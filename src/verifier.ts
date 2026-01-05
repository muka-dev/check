/**
 * Verifier - Verifies zero-knowledge age proofs without learning the actual age
 */

import {
  AgeProof,
  VerificationResult,
  IssuerConfig,
} from './types';
import {
  verifyAgeProof,
} from './crypto';

/**
 * Verifier class for checking age proofs
 */
export class Verifier {
  private trustedIssuers: Map<string, Omit<IssuerConfig, 'privateKey'>>;

  constructor(trustedIssuers: Omit<IssuerConfig, 'privateKey'>[] = []) {
    this.trustedIssuers = new Map();
    trustedIssuers.forEach(issuer => {
      this.trustedIssuers.set(issuer.publicKey, issuer);
    });
  }

  /**
   * Add a trusted issuer to the verifier
   */
  addTrustedIssuer(issuer: Omit<IssuerConfig, 'privateKey'>): void {
    this.trustedIssuers.set(issuer.publicKey, issuer);
  }

  /**
   * Remove a trusted issuer from the verifier
   */
  removeTrustedIssuer(publicKey: string): void {
    this.trustedIssuers.delete(publicKey);
  }

  /**
   * Get list of all trusted issuers
   */
  getTrustedIssuers(): Omit<IssuerConfig, 'privateKey'>[] {
    return Array.from(this.trustedIssuers.values());
  }

  /**
   * Verify an age proof
   * @param proof - The age proof to verify
   * @returns Verification result indicating if the proof is valid
   */
  verify(proof: AgeProof): VerificationResult {
    const verifiedAt = new Date();

    try {
      // Validate proof structure
      this.validateProofStructure(proof);

      // Check if issuer is trusted
      const issuerPublicKey = proof.publicInputs.issuerPublicKey;
      if (!this.trustedIssuers.has(issuerPublicKey)) {
        return {
          isValid: false,
          minimumAge: proof.minimumAge,
          error: 'Issuer is not trusted',
          verifiedAt,
        };
      }

      // Parse verification date
      const verificationDate = new Date(proof.publicInputs.verificationDate);
      if (isNaN(verificationDate.getTime())) {
        return {
          isValid: false,
          minimumAge: proof.minimumAge,
          error: 'Invalid verification date',
          verifiedAt,
        };
      }

      // Check that the proof is not too old (e.g., max 1 hour)
      const proofAge = verifiedAt.getTime() - proof.generatedAt.getTime();
      const maxProofAge = 60 * 60 * 1000; // 1 hour in milliseconds
      if (proofAge > maxProofAge) {
        return {
          isValid: false,
          minimumAge: proof.minimumAge,
          error: 'Proof is too old (max 1 hour)',
          verifiedAt,
        };
      }

      // Verify the cryptographic proof
      const isValid = verifyAgeProof(
        proof.proof,
        proof.publicInputs.credentialCommitment,
        proof.minimumAge,
        verificationDate,
        issuerPublicKey
      );

      if (!isValid) {
        return {
          isValid: false,
          minimumAge: proof.minimumAge,
          error: 'Cryptographic proof verification failed',
          verifiedAt,
        };
      }

      // Proof is valid
      return {
        isValid: true,
        minimumAge: proof.minimumAge,
        verifiedAt,
      };
    } catch (error) {
      return {
        isValid: false,
        minimumAge: proof.minimumAge,
        error: error instanceof Error ? error.message : 'Unknown error',
        verifiedAt,
      };
    }
  }

  /**
   * Validate the structure of a proof
   */
  private validateProofStructure(proof: AgeProof): void {
    if (!proof) {
      throw new Error('Proof is required');
    }

    if (!proof.proof || typeof proof.proof !== 'string') {
      throw new Error('Invalid proof data');
    }

    if (typeof proof.minimumAge !== 'number' || proof.minimumAge < 0 || proof.minimumAge > 150) {
      throw new Error('Invalid minimum age');
    }

    if (!proof.publicInputs) {
      throw new Error('Public inputs are required');
    }

    if (!proof.publicInputs.credentialCommitment) {
      throw new Error('Credential commitment is required');
    }

    if (!proof.publicInputs.verificationDate) {
      throw new Error('Verification date is required');
    }

    if (!proof.publicInputs.issuerPublicKey) {
      throw new Error('Issuer public key is required');
    }

    if (!proof.generatedAt || !(proof.generatedAt instanceof Date)) {
      throw new Error('Invalid proof generation timestamp');
    }
  }
}
