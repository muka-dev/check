/**
 * Tests for the credential issuer
 */

import { CredentialIssuer } from '../issuer';
import { generateKeyPair } from '../crypto';

describe('CredentialIssuer', () => {
  let issuer: CredentialIssuer;
  let issuerKeys: { publicKey: string; privateKey: string };

  beforeEach(() => {
    issuerKeys = generateKeyPair();
    issuer = new CredentialIssuer({
      id: 'test-issuer',
      name: 'Test Authority',
      publicKey: issuerKeys.publicKey,
      privateKey: issuerKeys.privateKey,
    });
  });

  describe('constructor', () => {
    it('should create an issuer with valid config', () => {
      expect(issuer).toBeDefined();
      expect(issuer.getPublicConfig().id).toBe('test-issuer');
      expect(issuer.getPublicConfig().name).toBe('Test Authority');
    });

    it('should throw error if private key is missing', () => {
      expect(() => {
        new CredentialIssuer({
          id: 'test',
          name: 'Test',
          publicKey: issuerKeys.publicKey,
        });
      }).toThrow('Issuer must have a private key');
    });
  });

  describe('issueCredential', () => {
    it('should issue a valid credential', () => {
      const dateOfBirth = new Date('1990-01-01');
      const credential = issuer.issueCredential({ dateOfBirth });

      expect(credential).toBeDefined();
      expect(credential.id).toBeDefined();
      expect(credential.dateOfBirth).toEqual(dateOfBirth);
      expect(credential.issuerPublicKey).toBe(issuerKeys.publicKey);
      expect(credential.issuerSignature).toBeDefined();
      expect(credential.issuedAt).toBeInstanceOf(Date);
      expect(credential.expiresAt).toBeInstanceOf(Date);
    });

    it('should throw error for invalid date of birth', () => {
      expect(() => {
        issuer.issueCredential({ dateOfBirth: null as any });
      }).toThrow('Invalid date of birth');
    });

    it('should throw error for future date of birth', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      expect(() => {
        issuer.issueCredential({ dateOfBirth: futureDate });
      }).toThrow('Date of birth cannot be in the future');
    });

    it('should throw error for date of birth too far in past', () => {
      const veryOldDate = new Date();
      veryOldDate.setFullYear(veryOldDate.getFullYear() - 200);
      
      expect(() => {
        issuer.issueCredential({ dateOfBirth: veryOldDate });
      }).toThrow('Date of birth is too far in the past');
    });

    it('should generate unique credential IDs', () => {
      const dateOfBirth = new Date('1990-01-01');
      const credential1 = issuer.issueCredential({ dateOfBirth });
      const credential2 = issuer.issueCredential({ dateOfBirth });

      expect(credential1.id).not.toBe(credential2.id);
    });

    it('should set expiration date 5 years in future', () => {
      const dateOfBirth = new Date('1990-01-01');
      const credential = issuer.issueCredential({ dateOfBirth });

      const expectedExpiration = new Date();
      expectedExpiration.setFullYear(expectedExpiration.getFullYear() + 5);

      const expiresAt = credential.expiresAt as Date;
      const timeDiff = Math.abs(expiresAt.getTime() - expectedExpiration.getTime());
      
      // Allow for small time differences (within 1 second)
      expect(timeDiff).toBeLessThan(1000);
    });
  });

  describe('getPublicConfig', () => {
    it('should return config without private key', () => {
      const publicConfig = issuer.getPublicConfig();

      expect(publicConfig.id).toBe('test-issuer');
      expect(publicConfig.name).toBe('Test Authority');
      expect(publicConfig.publicKey).toBe(issuerKeys.publicKey);
      expect((publicConfig as any).privateKey).toBeUndefined();
    });
  });
});
