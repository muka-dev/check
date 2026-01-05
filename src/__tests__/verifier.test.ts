/**
 * Tests for the verifier
 */

import { Verifier } from '../verifier';
import { ProofGenerator } from '../prover';
import { CredentialIssuer } from '../issuer';
import { generateKeyPair } from '../crypto';
import { AgeProof } from '../types';

describe('Verifier', () => {
  let verifier: Verifier;
  let issuer: CredentialIssuer;
  let proofGenerator: ProofGenerator;

  beforeEach(() => {
    const issuerKeys = generateKeyPair();
    issuer = new CredentialIssuer({
      id: 'test-issuer',
      name: 'Test Authority',
      publicKey: issuerKeys.publicKey,
      privateKey: issuerKeys.privateKey,
    });

    verifier = new Verifier([issuer.getPublicConfig()]);
    proofGenerator = new ProofGenerator();
  });

  describe('constructor', () => {
    it('should create verifier with trusted issuers', () => {
      expect(verifier).toBeDefined();
      expect(verifier.getTrustedIssuers()).toHaveLength(1);
    });

    it('should create verifier without trusted issuers', () => {
      const emptyVerifier = new Verifier();
      expect(emptyVerifier.getTrustedIssuers()).toHaveLength(0);
    });
  });

  describe('addTrustedIssuer', () => {
    it('should add a trusted issuer', () => {
      const newIssuerKeys = generateKeyPair();
      const newIssuer = {
        id: 'new-issuer',
        name: 'New Authority',
        publicKey: newIssuerKeys.publicKey,
      };

      verifier.addTrustedIssuer(newIssuer);
      expect(verifier.getTrustedIssuers()).toHaveLength(2);
    });
  });

  describe('removeTrustedIssuer', () => {
    it('should remove a trusted issuer', () => {
      const issuerConfig = issuer.getPublicConfig();
      verifier.removeTrustedIssuer(issuerConfig.publicKey);
      expect(verifier.getTrustedIssuers()).toHaveLength(0);
    });
  });

  describe('verify', () => {
    it('should verify a valid proof', () => {
      // Create credential for someone born 25 years ago
      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 25);
      const credential = issuer.issueCredential({ dateOfBirth });

      // Generate proof
      const proof = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
      });

      // Verify proof
      const result = verifier.verify(proof);

      expect(result.isValid).toBe(true);
      expect(result.minimumAge).toBe(18);
      expect(result.error).toBeUndefined();
      expect(result.verifiedAt).toBeInstanceOf(Date);
    });

    it('should reject proof from untrusted issuer', () => {
      // Create a different issuer
      const untrustedKeys = generateKeyPair();
      const untrustedIssuer = new CredentialIssuer({
        id: 'untrusted',
        name: 'Untrusted',
        publicKey: untrustedKeys.publicKey,
        privateKey: untrustedKeys.privateKey,
      });

      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 25);
      const credential = untrustedIssuer.issueCredential({ dateOfBirth });

      const proof = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
      });

      const result = verifier.verify(proof);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Issuer is not trusted');
    });

    it('should reject proof with invalid structure', () => {
      const invalidProof = {
        minimumAge: 18,
        proof: '',
        publicInputs: {
          credentialCommitment: '',
          verificationDate: '',
          issuerPublicKey: '',
        },
        generatedAt: new Date(),
      };

      const result = verifier.verify(invalidProof as AgeProof);

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject proof that is too old', () => {
      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 25);
      const credential = issuer.issueCredential({ dateOfBirth });

      const proof = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
      });

      // Simulate old proof by backdating it
      proof.generatedAt = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago

      const result = verifier.verify(proof);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too old');
    });

    it('should reject proof with invalid verification date', () => {
      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 25);
      const credential = issuer.issueCredential({ dateOfBirth });

      const proof = proofGenerator.generateProof({
        credential,
        minimumAge: 18,
      });

      // Corrupt the verification date
      proof.publicInputs.verificationDate = 'invalid-date';

      const result = verifier.verify(proof);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid verification date');
    });

    it('should verify multiple proofs independently', () => {
      const dateOfBirth1 = new Date();
      dateOfBirth1.setFullYear(dateOfBirth1.getFullYear() - 25);
      const credential1 = issuer.issueCredential({ dateOfBirth: dateOfBirth1 });

      const dateOfBirth2 = new Date();
      dateOfBirth2.setFullYear(dateOfBirth2.getFullYear() - 30);
      const credential2 = issuer.issueCredential({ dateOfBirth: dateOfBirth2 });

      const proof1 = proofGenerator.generateProof({
        credential: credential1,
        minimumAge: 18,
      });

      const proof2 = proofGenerator.generateProof({
        credential: credential2,
        minimumAge: 21,
      });

      const result1 = verifier.verify(proof1);
      const result2 = verifier.verify(proof2);

      expect(result1.isValid).toBe(true);
      expect(result1.minimumAge).toBe(18);
      expect(result2.isValid).toBe(true);
      expect(result2.minimumAge).toBe(21);
    });
  });
});
