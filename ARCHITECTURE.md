# System Architecture

## Overview

The Check age verification system consists of three main components:

1. **Credential Issuer** - Trusted authorities that issue age credentials
2. **Proof Generator** - User-side component that creates zero-knowledge proofs
3. **Verifier** - Service-side component that validates proofs

## Component Details

### 1. Credential Issuer

**Purpose**: Issues age credentials to users after verifying their identity and date of birth.

**Key Features**:
- Generates unique credential IDs
- Signs credentials with issuer's private key
- Sets expiration dates (default: 5 years)
- Validates date of birth (not in future, not too old)

**Security Considerations**:
- Private key must be securely stored
- Only trusted entities should have issuer privileges
- Consider using Hardware Security Modules (HSM) in production

### 2. Proof Generator

**Purpose**: Creates zero-knowledge proofs that demonstrate age without revealing date of birth.

**Key Features**:
- Validates user meets minimum age requirement
- Generates unique blinding factors for each proof
- Creates cryptographic commitments
- Ensures unlinkability between proofs

**Privacy Properties**:
- Date of birth never leaves the user's device in cleartext
- Each proof uses unique randomness (unlinkable)
- Only proves "over X years", not exact age

### 3. Verifier

**Purpose**: Validates age proofs from users.

**Key Features**:
- Maintains list of trusted issuers
- Verifies cryptographic proofs
- Checks proof freshness (max 1 hour old)
- Returns simple yes/no without learning actual age

**Security Considerations**:
- Only accepts proofs from trusted issuers
- Validates all proof components
- Rejects expired or malformed proofs

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Credential Issuance (One-time setup)               │
└─────────────────────────────────────────────────────────────┘

User → Trusted Issuer: "I was born on YYYY-MM-DD"
                        (with identity verification)
                        
Trusted Issuer → User: {
  id: "credential-123",
  dateOfBirth: "YYYY-MM-DD",
  issuerPublicKey: "...",
  issuerSignature: "...",
  expiresAt: "..."
}

┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Proof Generation (Each time verification needed)   │
└─────────────────────────────────────────────────────────────┘

User (Client-side):
1. Receives request: "Prove you are over 18"
2. Generates blinding factor (random)
3. Creates commitment to date of birth
4. Generates ZK proof
5. Sends proof to verifier

Proof = {
  minimumAge: 18,
  proof: "cryptographic-proof-data",
  publicInputs: {
    credentialCommitment: "...",
    verificationDate: "...",
    issuerPublicKey: "..."
  }
}

┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Verification (Service-side)                        │
└─────────────────────────────────────────────────────────────┘

Verifier receives proof:
1. Check issuer is trusted
2. Verify proof structure
3. Check proof is not too old
4. Validate cryptographic proof
5. Return result: { isValid: true/false }

Service learns: "User is over 18" ✓
Service does NOT learn: Actual date of birth ✗
```

## Cryptographic Building Blocks

### Hash Functions
- SHA-256 for all hashing operations
- Provides collision resistance and one-way property

### Commitments
```
Commitment = H(value || blindingFactor)
```
- Binds to a value without revealing it
- Blinding factor ensures unlinkability
- Can be opened later if needed

### Signatures
```
Signature = Sign(data, privateKey)
Verify(data, signature, publicKey) → true/false
```
- Authenticates credential issuer
- Prevents tampering with credentials
- Uses simplified signature scheme (production should use ECDSA/EdDSA)

### Zero-Knowledge Proofs (Simplified)
Current implementation uses hash-based proofs. Production systems should use:
- ZK-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge)
- ZK-STARKs (Zero-Knowledge Scalable Transparent Arguments of Knowledge)
- Libraries like SnarkJS, Circom, or libsnark

## Privacy Guarantees

### What is Hidden:
1. **Date of Birth**: Never revealed in any form
2. **Exact Age**: Only minimum age threshold is proven
3. **Identity**: Can be used anonymously (no name required)
4. **Linkability**: Each proof is unlinkable to others

### What is Revealed:
1. **Minimum Age Met**: "User is over X years"
2. **Issuer**: Which trusted authority issued the credential
3. **Validity**: Proof is valid at verification time

### Unlinkability

Each proof uses a unique blinding factor:
```
Proof_1: Commitment_1 = H(DoB || Blinding_1)
Proof_2: Commitment_2 = H(DoB || Blinding_2)

Even if DoB is the same, Commitment_1 ≠ Commitment_2
→ Proofs cannot be linked to the same user
```

## Security Model

### Threat Model

**What we protect against**:
- ✓ Verifiers learning date of birth
- ✓ Verifiers learning exact age
- ✓ Tracking users across services
- ✓ Forged credentials (signature verification)
- ✓ Replay attacks (proof freshness check)

**What we don't protect against** (out of scope):
- ✗ Compromised issuer private keys
- ✗ User lying to issuer about date of birth
- ✗ Physical coercion
- ✗ Device compromise revealing stored credentials

### Trust Assumptions

1. **Trusted Issuers**: Credential issuers correctly verify identity and date of birth
2. **Secure Key Storage**: Private keys are stored securely (not in production with simplified crypto)
3. **Honest Verification**: Verifiers correctly implement the protocol
4. **Clock Synchronization**: System clocks are reasonably accurate

## Interoperability

### Standards Compatibility

The system is designed to be compatible with:
- JSON data structures (easy serialization)
- REST APIs (standard HTTP transport)
- W3C Verifiable Credentials (future extension)
- DID (Decentralized Identifiers) - future extension

### Integration Points

Services can integrate at different levels:

1. **Full Integration**: Use the entire library
2. **Verification Only**: Just verify proofs (most common for services)
3. **Issuance Only**: Just issue credentials (for identity providers)

### Example API Endpoints

```
POST /api/credentials/issue
POST /api/proofs/generate
POST /api/proofs/verify
GET  /api/issuers/trusted
```

## Performance Considerations

### Proof Generation
- Time: < 100ms (simplified implementation)
- With ZK-SNARKs: 1-10 seconds (more secure)
- Client-side only (no server needed)

### Proof Verification
- Time: < 50ms
- Stateless (can be scaled horizontally)
- No database queries needed

### Credential Storage
- Size: < 1KB per credential
- Can be stored on user's device
- No central database required

## Future Enhancements

### Short-term
1. Replace simplified crypto with proper ZK-SNARK library
2. Add credential revocation mechanism
3. Implement W3C Verifiable Credentials format
4. Add batch verification support

### Medium-term
1. Blockchain-based issuer registry
2. Decentralized issuer governance
3. Mobile SDKs (iOS, Android)
4. Browser extensions

### Long-term
1. Cross-chain credential portability
2. Selective disclosure of other attributes
3. Recursive proof composition
4. Threshold credentials (multiple issuers)

## Deployment Recommendations

### Development
- Use in-memory storage
- Single trusted issuer
- Relaxed proof freshness (1 hour)

### Staging
- Database-backed credential storage
- Multiple test issuers
- Monitoring and logging

### Production
- HSM for issuer keys
- Distributed issuer infrastructure
- CDN for verifier endpoints
- Real-time monitoring
- Audit logging
- Incident response plan
- Regular security audits

## Compliance

### GDPR Considerations
- ✓ Data minimization (only age threshold revealed)
- ✓ Purpose limitation (only for age verification)
- ✓ Storage limitation (credentials can expire)
- ✓ Right to erasure (user controls credential)

### eIDAS Compatibility
- Can integrate with eIDAS identity providers
- Supports qualified electronic signatures
- Maintains audit trails

### Age Verification Laws
- Compliant with various jurisdictions' age verification requirements
- Provides strong privacy protections
- Auditable and transparent
