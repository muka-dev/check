# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by:

1. **Do NOT** open a public issue
2. Email the maintainers directly (contact info in package.json or repository)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We take security seriously and will respond within 48 hours.

## Security Considerations

This project is designed with security and privacy in mind:

### Cryptographic Services

The current implementation uses a **mock cryptographic service** for demonstration purposes. 

**⚠️ WARNING**: Do NOT use this in production without implementing proper cryptographic proofs.

For production use:
- Implement real zero-knowledge proofs (zk-SNARKs, zk-STARKs)
- Use established cryptographic libraries
- Conduct security audits
- Follow OWASP guidelines

### Data Privacy

- No actual age is stored, only proofs
- Proofs should be generated using zero-knowledge cryptography
- User secrets should never be logged or stored
- All sensitive operations should be audited

### Best Practices

1. **Input Validation**: All inputs are validated at the domain layer
2. **Type Safety**: Strict TypeScript helps prevent many vulnerabilities
3. **Immutability**: Value objects are immutable by design
4. **Dependency Management**: Keep dependencies up to date
5. **Code Review**: All changes should be reviewed

### Dependency Security

Run regular security audits:

```bash
npm audit
npm audit fix
```

## Secure Development

When contributing:

1. Never commit secrets or API keys
2. Validate all inputs
3. Use prepared statements for database queries
4. Implement proper authentication and authorization
5. Follow principle of least privilege
6. Log security-relevant events (without sensitive data)

## Security Updates

Security updates will be released as soon as possible after discovery.

## Responsible Disclosure

We appreciate responsible disclosure of vulnerabilities. We will:

1. Acknowledge receipt within 48 hours
2. Provide an estimated timeline for a fix
3. Credit you in the security advisory (if desired)
4. Release a patch as quickly as possible

Thank you for helping keep this project secure!
