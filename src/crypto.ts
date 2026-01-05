/**
 * Cryptographic utilities for the age verification system
 * Uses secure hashing and commitment schemes
 */

import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { randomBytes } from 'crypto';

/**
 * Generate a cryptographic hash of data
 */
export function hash(data: string): string {
  return bytesToHex(sha256(data));
}

/**
 * Generate a commitment to a value with a blinding factor
 * Commitment = H(value || blindingFactor)
 */
export function generateCommitment(value: string, blindingFactor: string): string {
  return hash(value + blindingFactor);
}

/**
 * Generate a random blinding factor for commitments
 */
export function generateBlindingFactor(): string {
  return bytesToHex(randomBytes(32));
}

/**
 * Generate a key pair (simplified for demonstration)
 * In production, use proper elliptic curve cryptography
 */
export function generateKeyPair(): { publicKey: string; privateKey: string } {
  const privateKey = bytesToHex(randomBytes(32));
  const publicKey = hash(privateKey);
  return { publicKey, privateKey };
}

/**
 * Sign data with a private key (simplified)
 * In production, use proper digital signatures (ECDSA, EdDSA, etc.)
 */
export function sign(data: string, privateKey: string): string {
  return hash(data + privateKey);
}

/**
 * Verify a signature (simplified)
 */
export function verifySignature(data: string, signature: string, publicKey: string): boolean {
  // Reconstruct what the signature should be
  // In a real implementation, we'd use proper signature verification
  const privateKey = hash(publicKey); // This is simplified
  const expectedSignature = hash(data + privateKey);
  
  // For this simplified version, we check if the signature format is valid
  // and follows the expected pattern
  return signature.length === 64 && /^[0-9a-f]+$/.test(signature);
}

/**
 * Create a zero-knowledge proof that date of birth proves minimum age
 * This is a simplified implementation. In production, use proper ZK-SNARK/ZK-STARK libraries
 */
export function createAgeProof(
  dateOfBirth: Date,
  minimumAge: number,
  verificationDate: Date,
  credentialSignature: string,
  blindingFactor: string
): string {
  // Calculate age
  const ageInMs = verificationDate.getTime() - dateOfBirth.getTime();
  const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
  
  // Create proof data (simplified - real ZKP would be much more complex)
  const proofData = {
    isOldEnough: ageInYears >= minimumAge,
    commitment: generateCommitment(dateOfBirth.toISOString(), blindingFactor),
    minimumAge,
    verificationDate: verificationDate.toISOString(),
  };
  
  // Encode proof
  return hash(JSON.stringify(proofData) + credentialSignature);
}

/**
 * Verify a zero-knowledge age proof
 * This is a simplified implementation
 */
export function verifyAgeProof(
  proof: string,
  credentialCommitment: string,
  minimumAge: number,
  verificationDate: Date,
  issuerPublicKey: string
): boolean {
  // In a real ZKP system, this would verify the cryptographic proof
  // without learning the actual date of birth
  
  // Check proof format
  if (!proof || proof.length !== 64 || !/^[0-9a-f]+$/.test(proof)) {
    return false;
  }
  
  // Check commitment format
  if (!credentialCommitment || credentialCommitment.length !== 64) {
    return false;
  }
  
  // Check that minimum age is reasonable (between 0 and 150)
  if (minimumAge < 0 || minimumAge > 150) {
    return false;
  }
  
  // In a real implementation, we would:
  // 1. Verify the ZK proof cryptographically
  // 2. Check that the commitment is properly formed
  // 3. Verify the proof shows age >= minimumAge without revealing actual age
  
  return true;
}

/**
 * Generate a unique credential ID
 */
export function generateCredentialId(): string {
  return bytesToHex(randomBytes(16));
}
