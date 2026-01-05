/**
 * Tests for the proof generator
 */

import { ProofGenerator } from '../prover';
import { CredentialIssuer } from '../issuer';
import { generateKeyPair } from '../crypto';
import { AgeCredential } from '../types';

describe('ProofGenerator', () => {
  let proofGenerator: ProofGenerator;
  let issuer: CredentialIssuer;
  let credential: AgeCredential;

  beforeEach(() => {
    proofGenerator = new ProofGenerator();
    
    const issuerKeys = generateKeyPair();
    issuer = new CredentialIssuer({
      id: 'test-issuer',
      name: 'Test Authority',
      publicKey: issuerKeys.publicKey,
      privateKey: issuerKeys.privateKey,
    });

    // Create credential for someone born 25 years ago
    const dateOfBirth = new Date();
    dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 25);
    credential = issuer.issueCredential({ dateOfBirth });
  });

  describe('generateProof', () => {
    it('should generate a valid proof for user meeting age requirement', () => {
      const proof = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
      });

      expect(proof).toBeDefined();
      expect(proof.minimumAge).toBe(18);
      expect(proof.proof).toBeDefined();
      expect(proof.proof).toMatch(/^[0-9a-f]+$/);
      expect(proof.publicInputs).toBeDefined();
      expect(proof.publicInputs.credentialCommitment).toBeDefined();
      expect(proof.publicInputs.issuerPublicKey).toBe(credential.issuerPublicKey);
      expect(proof.generatedAt).toBeInstanceOf(Date);
    });

    it('should throw error if user does not meet age requirement', () => {
      expect(() => {
        proofGenerator.generateProof({
          credential,
          minimumAge: 30, // User is only 25
        });
      }).toThrow('User does not meet minimum age requirement');
    });

    it('should throw error for expired credential', () => {
      const expiredCredential = { ...credential };
      expiredCredential.expiresAt = new Date('2020-01-01');

      expect(() => {
        proofGenerator.generateProof({
          credential: expiredCredential,
          minimumAge: 18,
        });
      }).toThrow('Credential has expired');
    });

    it('should throw error for missing credential', () => {
      expect(() => {
        proofGenerator.generateProof({
          credential: null as any,
          minimumAge: 18,
        });
      }).toThrow('Credential is required');
    });

    it('should throw error for invalid minimum age', () => {
      expect(() => {
        proofGenerator.generateProof({
          credential,
          minimumAge: -1,
        });
      }).toThrow('Valid minimum age is required');

      expect(() => {
        proofGenerator.generateProof({
          credential,
          minimumAge: 200,
        });
      }).toThrow('Minimum age cannot exceed 150');
    });

    it('should accept custom verification date', () => {
      const customDate = new Date('2025-01-01');
      const proof = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
        verificationDate: customDate,
      });

      expect(proof.publicInputs.verificationDate).toBe(customDate.toISOString());
    });

    it('should generate different commitments for each proof', () => {
      const proof1 = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
      });

      const proof2 = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
      });

      // Commitments should be different due to different blinding factors
      expect(proof1.publicInputs.credentialCommitment).not.toBe(
        proof2.publicInputs.credentialCommitment
      );
    });

    it('should throw error if verification date is before date of birth', () => {
      const invalidDate = new Date(credential.dateOfBirth.getTime() - 1000);
      
      expect(() => {
        proofGenerator.generateProof({
          credential,
          minimumAge: 18,
          verificationDate: invalidDate,
        });
      }).toThrow('Verification date cannot be before date of birth');
    });
  });
});
