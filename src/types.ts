/**
 * Types and interfaces for the decentralized age verification system
 */

/**
 * Age credential issued by a trusted authority
 */
export interface AgeCredential {
  /** Unique credential identifier */
  id: string;
  
  /** Date of birth (stored only in credential, never revealed) */
  dateOfBirth: Date;
  
  /** Issuer's public key */
  issuerPublicKey: string;
  
  /** Issuer's signature over the credential */
  issuerSignature: string;
  
  /** Timestamp when credential was issued */
  issuedAt: Date;
  
  /** Optional: Credential expiration date */
  expiresAt?: Date;
}

/**
 * Zero-knowledge proof that proves age without revealing date of birth
 */
export interface AgeProof {
  /** The minimum age being proven (e.g., 18 for "over 18") */
  minimumAge: number;
  
  /** The proof data (cryptographic proof) */
  proof: string;
  
  /** Public inputs that can be verified */
  publicInputs: {
    /** Commitment to the credential */
    credentialCommitment: string;
    
    /** Current date used for verification */
    verificationDate: string;
    
    /** Issuer's public key */
    issuerPublicKey: string;
  };
  
  /** Timestamp when proof was generated */
  generatedAt: Date;
}

/**
 * Result of age proof verification
 */
export interface VerificationResult {
  /** Whether the proof is valid */
  isValid: boolean;
  
  /** The minimum age that was proven */
  minimumAge: number;
  
  /** Error message if verification failed */
  error?: string;
  
  /** Timestamp of verification */
  verifiedAt: Date;
}

/**
 * Configuration for a trusted issuer
 */
export interface IssuerConfig {
  /** Issuer's unique identifier */
  id: string;
  
  /** Issuer's name */
  name: string;
  
  /** Issuer's public key */
  publicKey: string;
  
  /** Issuer's private key (only for credential issuance) */
  privateKey?: string;
}

/**
 * Request to issue a new age credential
 */
export interface CredentialRequest {
  /** User's date of birth */
  dateOfBirth: Date;
  
  /** Optional: Additional user identifier (anonymized) */
  anonymousId?: string;
}

/**
 * Request to generate an age proof
 */
export interface ProofRequest {
  /** The credential to create a proof for */
  credential: AgeCredential;
  
  /** Minimum age to prove (e.g., 18 for "over 18") */
  minimumAge: number;
  
  /** Optional: Custom verification date (defaults to now) */
  verificationDate?: Date;
}
