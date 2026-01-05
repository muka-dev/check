/**
 * Integration tests for the complete age verification workflow
 */

import {
  CredentialIssuer,
  ProofGenerator,
  Verifier,
  generateKeyPair,
} from '../index';

describe('Integration Tests', () => {
  describe('Complete Workflow', () => {
    it('should complete full age verification workflow', () => {
      // Setup: Create issuer
      const issuerKeys = generateKeyPair();
      const issuer = new CredentialIssuer({
        id: 'gov-001',
        name: 'Government ID Authority',
        publicKey: issuerKeys.publicKey,
        privateKey: issuerKeys.privateKey,
      });

      // Step 1: User gets credential
      const userDateOfBirth = new Date('1995-05-15');
      const credential = issuer.issueCredential({
        dateOfBirth: userDateOfBirth,
      });

      expect(credential).toBeDefined();
      expect(credential.dateOfBirth).toEqual(userDateOfBirth);

      // Step 2: User generates proof
      const proofGenerator = new ProofGenerator();
      const ageProof = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
      });

      expect(ageProof).toBeDefined();
      expect(ageProof.minimumAge).toBe(18);

      // Step 3: Service verifies proof
      const verifier = new Verifier([issuer.getPublicConfig()]);
      const result = verifier.verify(ageProof);

      expect(result.isValid).toBe(true);
      expect(result.minimumAge).toBe(18);
      expect(result.error).toBeUndefined();
    });

    it('should maintain privacy - same user generates unlinkable proofs', () => {
      const issuerKeys = generateKeyPair();
      const issuer = new CredentialIssuer({
        id: 'issuer-1',
        name: 'Privacy Authority',
        publicKey: issuerKeys.publicKey,
        privateKey: issuerKeys.privateKey,
      });

      const userDateOfBirth = new Date('1990-01-01');
      const credential = issuer.issueCredential({ dateOfBirth: userDateOfBirth });

      const proofGenerator = new ProofGenerator();
      
      // Generate two proofs for same user
      const proof1 = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
      });

      const proof2 = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
      });

      // Proofs should have different commitments (unlinkable)
      expect(proof1.publicInputs.credentialCommitment).not.toBe(
        proof2.publicInputs.credentialCommitment
      );

      // Both should verify successfully
      const verifier = new Verifier([issuer.getPublicConfig()]);
      expect(verifier.verify(proof1).isValid).toBe(true);
      expect(verifier.verify(proof2).isValid).toBe(true);
    });

    it('should support multiple trusted issuers', () => {
      // Create two different issuers
      const issuer1Keys = generateKeyPair();
      const issuer1 = new CredentialIssuer({
        id: 'issuer-1',
        name: 'Authority 1',
        publicKey: issuer1Keys.publicKey,
        privateKey: issuer1Keys.privateKey,
      });

      const issuer2Keys = generateKeyPair();
      const issuer2 = new CredentialIssuer({
        id: 'issuer-2',
        name: 'Authority 2',
        publicKey: issuer2Keys.publicKey,
        privateKey: issuer2Keys.privateKey,
      });

      // Create verifier that trusts both
      const verifier = new Verifier([
        issuer1.getPublicConfig(),
        issuer2.getPublicConfig(),
      ]);

      // Issue credentials from both issuers
      const dateOfBirth = new Date('1990-01-01');
      const credential1 = issuer1.issueCredential({ dateOfBirth });
      const credential2 = issuer2.issueCredential({ dateOfBirth });

      // Generate and verify proofs from both
      const proofGenerator = new ProofGenerator();
      const proof1 = proofGenerator.generateProof({
        credential: credential1,
        minimumAge: 18,
      });
      const proof2 = proofGenerator.generateProof({
        credential: credential2,
        minimumAge: 18,
      });

      expect(verifier.verify(proof1).isValid).toBe(true);
      expect(verifier.verify(proof2).isValid).toBe(true);
    });

    it('should reject proof when user does not meet age requirement', () => {
      const issuerKeys = generateKeyPair();
      const issuer = new CredentialIssuer({
        id: 'issuer-1',
        name: 'Authority',
        publicKey: issuerKeys.publicKey,
        privateKey: issuerKeys.privateKey,
      });

      // User born only 16 years ago
      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 16);
      const credential = issuer.issueCredential({ dateOfBirth });

      const proofGenerator = new ProofGenerator();

      // Should fail to generate proof for age 18
      expect(() => {
        proofGenerator.generateProof({
          credential,
          minimumAge: 18,
        });
      }).toThrow('User does not meet minimum age requirement');
    });

    it('should handle different age thresholds correctly', () => {
      const issuerKeys = generateKeyPair();
      const issuer = new CredentialIssuer({
        id: 'issuer-1',
        name: 'Authority',
        publicKey: issuerKeys.publicKey,
        privateKey: issuerKeys.privateKey,
      });

      // User born 25 years ago
      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 25);
      const credential = issuer.issueCredential({ dateOfBirth });

      const proofGenerator = new ProofGenerator();
      const verifier = new Verifier([issuer.getPublicConfig()]);

      // Should succeed for ages 13, 16, 18, 21
      [13, 16, 18, 21].forEach(age => {
        const proof = proofGenerator.generateProof({
          credential,
          minimumAge: age,
        });
        const result = verifier.verify(proof);
        expect(result.isValid).toBe(true);
        expect(result.minimumAge).toBe(age);
      });

      // Should fail for age 30
      expect(() => {
        proofGenerator.generateProof({
          credential,
          minimumAge: 30,
        });
      }).toThrow();
    });
  });

  describe('Security Properties', () => {
    it('should not reveal date of birth in proof', () => {
      const issuerKeys = generateKeyPair();
      const issuer = new CredentialIssuer({
        id: 'issuer-1',
        name: 'Authority',
        publicKey: issuerKeys.publicKey,
        privateKey: issuerKeys.privateKey,
      });

      const dateOfBirth = new Date('1990-05-15');
      const credential = issuer.issueCredential({ dateOfBirth });

      const proofGenerator = new ProofGenerator();
      const proof = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
      });

      // Proof should not contain date of birth in any readable form
      const proofString = JSON.stringify(proof);
      expect(proofString).not.toContain('1990');
      expect(proofString).not.toContain('1990-05-15');
      expect(proofString).not.toContain(dateOfBirth.toISOString());
      
      // Verify that the proof data is cryptographic (hex string)
      expect(proof.proof).toMatch(/^[0-9a-f]+$/);
      expect(proof.publicInputs.credentialCommitment).toMatch(/^[0-9a-f]+$/);
    });

    it('should use unique commitments for privacy', () => {
      const issuerKeys = generateKeyPair();
      const issuer = new CredentialIssuer({
        id: 'issuer-1',
        name: 'Authority',
        publicKey: issuerKeys.publicKey,
        privateKey: issuerKeys.privateKey,
      });

      const dateOfBirth = new Date('1990-01-01');
      const credential = issuer.issueCredential({ dateOfBirth });

      const proofGenerator = new ProofGenerator();
      
      // Generate multiple proofs
      const proofs = Array(5).fill(null).map(() => 
        proofGenerator.generateProof({
          credential,
          minimumAge: 18,
        })
      );

      // All commitments should be unique
      const commitments = proofs.map(p => p.publicInputs.credentialCommitment);
      const uniqueCommitments = new Set(commitments);
      expect(uniqueCommitments.size).toBe(5);
    });
  });
});
