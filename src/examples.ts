/**
 * Example usage of the decentralized age verification system
 */

import {
  CredentialIssuer,
  ProofGenerator,
  Verifier,
  generateKeyPair,
} from './index';

// Example 1: Complete workflow
export function completeWorkflowExample() {
  console.log('=== Decentralized Age Verification Example ===\n');

  // Step 1: Create a trusted issuer (e.g., government agency, trusted ID provider)
  console.log('Step 1: Setting up trusted issuer...');
  const issuerKeys = generateKeyPair();
  const issuer = new CredentialIssuer({
    id: 'issuer-001',
    name: 'Government ID Authority',
    publicKey: issuerKeys.publicKey,
    privateKey: issuerKeys.privateKey,
  });
  console.log('Issuer created with public key:', issuerKeys.publicKey.substring(0, 16) + '...\n');

  // Step 2: User requests a credential with their date of birth
  console.log('Step 2: User requests age credential...');
  const userDateOfBirth = new Date('1995-05-15'); // User born on May 15, 1995
  const credential = issuer.issueCredential({
    dateOfBirth: userDateOfBirth,
  });
  console.log('Credential issued with ID:', credential.id);
  console.log('Date of birth stored in credential (private):', credential.dateOfBirth.toISOString());
  console.log('Credential expires:', credential.expiresAt?.toISOString(), '\n');

  // Step 3: User generates a zero-knowledge proof (e.g., to prove they're over 18)
  console.log('Step 3: User generates proof of being over 18...');
  const proofGenerator = new ProofGenerator();
  const ageProof = proofGenerator.generateProof({
    credential,
    minimumAge: 18,
  });
  console.log('Proof generated!');
  console.log('Minimum age proven:', ageProof.minimumAge);
  console.log('Proof data (cryptographic):', ageProof.proof.substring(0, 32) + '...');
  console.log('Important: The actual date of birth is NOT revealed in the proof!\n');

  // Step 4: Verifier checks the proof
  console.log('Step 4: Service verifies the proof...');
  const verifier = new Verifier([issuer.getPublicConfig()]);
  const result = verifier.verify(ageProof);
  
  console.log('Verification result:');
  console.log('- Is valid:', result.isValid);
  console.log('- Minimum age verified:', result.minimumAge);
  console.log('- Verified at:', result.verifiedAt.toISOString());
  
  if (result.isValid) {
    console.log('\n✓ User successfully proved they are over 18 without revealing their exact age!');
  } else {
    console.log('\n✗ Verification failed:', result.error);
  }

  return { credential, ageProof, result };
}

// Example 2: Multiple age thresholds
export function multipleAgeThresholdsExample() {
  console.log('\n\n=== Multiple Age Thresholds Example ===\n');

  // Setup
  const issuerKeys = generateKeyPair();
  const issuer = new CredentialIssuer({
    id: 'issuer-002',
    name: 'Digital ID Provider',
    publicKey: issuerKeys.publicKey,
    privateKey: issuerKeys.privateKey,
  });

  const userDateOfBirth = new Date('2000-01-01');
  const credential = issuer.issueCredential({ dateOfBirth: userDateOfBirth });
  const proofGenerator = new ProofGenerator();
  const verifier = new Verifier([issuer.getPublicConfig()]);

  // Test different age thresholds
  const thresholds = [13, 16, 18, 21];
  
  console.log('User born on:', userDateOfBirth.toISOString());
  console.log('Testing different age requirements:\n');

  thresholds.forEach(age => {
    try {
      const proof = proofGenerator.generateProof({
        credential,
        minimumAge: age,
      });
      const result = verifier.verify(proof);
      console.log(`Age ${age}: ${result.isValid ? '✓ PASS' : '✗ FAIL'}`);
    } catch (error) {
      console.log(`Age ${age}: ✗ FAIL - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
}

// Example 3: Privacy preservation
export function privacyPreservationExample() {
  console.log('\n\n=== Privacy Preservation Example ===\n');

  const issuerKeys = generateKeyPair();
  const issuer = new CredentialIssuer({
    id: 'issuer-003',
    name: 'Privacy-First ID',
    publicKey: issuerKeys.publicKey,
    privateKey: issuerKeys.privateKey,
  });

  // Two users with different dates of birth
  const user1DoB = new Date('1990-03-20');
  const user2DoB = new Date('1995-11-10');

  const credential1 = issuer.issueCredential({ dateOfBirth: user1DoB });
  const credential2 = issuer.issueCredential({ dateOfBirth: user2DoB });

  const proofGenerator = new ProofGenerator();
  
  // Both generate proofs for being over 18
  const proof1 = proofGenerator.generateProof({ credential: credential1, minimumAge: 18 });
  const proof2 = proofGenerator.generateProof({ credential: credential2, minimumAge: 18 });

  console.log('User 1 - Actual DoB:', user1DoB.toISOString(), '(kept private)');
  console.log('User 1 - Proof commitment:', proof1.publicInputs.credentialCommitment.substring(0, 32) + '...');
  
  console.log('\nUser 2 - Actual DoB:', user2DoB.toISOString(), '(kept private)');
  console.log('User 2 - Proof commitment:', proof2.publicInputs.credentialCommitment.substring(0, 32) + '...');

  console.log('\n✓ Both users can prove they are over 18');
  console.log('✓ Their actual dates of birth remain private');
  console.log('✓ Each proof uses a unique commitment (unlinkable)');
  console.log('✓ Verifiers learn only "over 18", nothing more');
}

// Run examples if executed directly
if (require.main === module) {
  completeWorkflowExample();
  multipleAgeThresholdsExample();
  privacyPreservationExample();
}
