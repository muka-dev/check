/**
 * Decentralized Age Verification System
 * 
 * A privacy-preserving age verification system using zero-knowledge proofs.
 * Users can prove they are over a certain age without revealing their date of birth.
 * 
 * @module @muka-dev/check
 */

// Export types
export type {
  AgeCredential,
  AgeProof,
  VerificationResult,
  IssuerConfig,
  CredentialRequest,
  ProofRequest,
} from './types';

// Export classes
export { CredentialIssuer } from './issuer';
export { ProofGenerator } from './prover';
export { Verifier } from './verifier';

// Export crypto utilities for advanced usage
export {
  generateKeyPair,
  hash,
  generateCommitment,
  generateBlindingFactor,
} from './crypto';
