/**
 * Credential Issuer - Trusted authority that issues age credentials
 */

import {
  AgeCredential,
  IssuerConfig,
  CredentialRequest,
} from './types';
import {
  generateCredentialId,
  sign,
  hash,
} from './crypto';

/**
 * Issuer class for creating age credentials
 */
export class CredentialIssuer {
  private config: IssuerConfig;

  constructor(config: IssuerConfig) {
    if (!config.privateKey) {
      throw new Error('Issuer must have a private key to issue credentials');
    }
    this.config = config;
  }

  /**
   * Issue a new age credential to a user
   * @param request - The credential request containing date of birth
   * @returns The issued age credential
   */
  issueCredential(request: CredentialRequest): AgeCredential {
    // Validate date of birth
    if (!request.dateOfBirth || !(request.dateOfBirth instanceof Date)) {
      throw new Error('Invalid date of birth');
    }

    // Check that date of birth is in the past
    if (request.dateOfBirth.getTime() > Date.now()) {
      throw new Error('Date of birth cannot be in the future');
    }

    // Check that date of birth is reasonable (not more than 150 years ago)
    const maxAge = 150;
    const maxAgeMs = maxAge * 365.25 * 24 * 60 * 60 * 1000;
    if (Date.now() - request.dateOfBirth.getTime() > maxAgeMs) {
      throw new Error('Date of birth is too far in the past');
    }

    const credential: AgeCredential = {
      id: generateCredentialId(),
      dateOfBirth: request.dateOfBirth,
      issuerPublicKey: this.config.publicKey,
      issuerSignature: '',
      issuedAt: new Date(),
      expiresAt: this.calculateExpirationDate(),
    };

    // Sign the credential
    credential.issuerSignature = this.signCredential(credential);

    return credential;
  }

  /**
   * Sign a credential with the issuer's private key
   */
  private signCredential(credential: AgeCredential): string {
    if (!this.config.privateKey) {
      throw new Error('Cannot sign without private key');
    }

    // Create a canonical representation of the credential for signing
    const credentialData = {
      id: credential.id,
      dateOfBirth: credential.dateOfBirth.toISOString(),
      issuerPublicKey: credential.issuerPublicKey,
      issuedAt: credential.issuedAt.toISOString(),
      expiresAt: credential.expiresAt?.toISOString(),
    };

    const dataToSign = JSON.stringify(credentialData);
    return sign(dataToSign, this.config.privateKey);
  }

  /**
   * Calculate expiration date for a credential (default: 5 years)
   */
  private calculateExpirationDate(): Date {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 5);
    return expirationDate;
  }

  /**
   * Get the issuer's public configuration (without private key)
   */
  getPublicConfig(): Omit<IssuerConfig, 'privateKey'> {
    return {
      id: this.config.id,
      name: this.config.name,
      publicKey: this.config.publicKey,
    };
  }
}
