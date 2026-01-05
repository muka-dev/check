# Check - Dezentrale Altersverifikation mit Zero-Knowledge-Proofs

Ein datensparsames, dezentrales Altersverifikationssystem, das Privatsphäre und Jugendschutz vereint.

## 🎯 Überblick

**Check** ist eine Open-Source-Lösung für die Altersverifikation, die modernste kryptographische Verfahren nutzt, um Nutzer zu schützen:

- ✅ **Zero-Knowledge-Proofs**: Beweise "über X Jahre" ohne Offenlegung des Geburtsdatums
- ✅ **Datensparsamkeit**: Keine personenbezogenen Daten werden preisgegeben
- ✅ **Dezentral**: Keine zentrale Datenbank mit sensiblen Informationen
- ✅ **Interoperabel**: Offene Standards für breite Kompatibilität
- ✅ **Optional anonym**: Nutzer behalten die Kontrolle über ihre Identität
- ✅ **Open Source**: Transparente Implementierung zur Überprüfung

## 📋 Anforderungen

Dieses Projekt erfüllt folgende Anforderungen:

> Unser Projekt entwickelt eine dezentrale, datensparsame Altersverifikation: Nutzer erhalten von vertrauenswürdigen Stellen ein digitales Alters‑Credential und beweisen per Zero‑Knowledge‑Proof nur „über X Jahre", ohne Namen oder Geburtsdatum offenzulegen. Open source, interoperabel und optional anonym, um Jugendschutz mit maximaler Privatsphäre zu verbinden.

## 🔧 Installation

```bash
npm install @muka-dev/check
```

## 🚀 Schnellstart

### 1. Credential von vertrauenswürdiger Stelle erhalten

```typescript
import { CredentialIssuer, generateKeyPair } from '@muka-dev/check';

// Vertrauenswürdige Stelle (z.B. Behörde) erstellt Issuer
const issuerKeys = generateKeyPair();
const issuer = new CredentialIssuer({
  id: 'gov-id-001',
  name: 'Bundesbehörde für Identitäten',
  publicKey: issuerKeys.publicKey,
  privateKey: issuerKeys.privateKey,
});

// Nutzer erhält Credential mit Geburtsdatum
const credential = issuer.issueCredential({
  dateOfBirth: new Date('1995-05-15'),
});

console.log('Credential erhalten:', credential.id);
// Das Geburtsdatum bleibt im Credential gespeichert (privat)
```

### 2. Zero-Knowledge-Proof generieren

```typescript
import { ProofGenerator } from '@muka-dev/check';

const proofGenerator = new ProofGenerator();

// Nutzer erstellt Beweis für "über 18"
const ageProof = proofGenerator.generateProof({
  credential,
  minimumAge: 18,
});

console.log('Beweis generiert für Mindestalter:', ageProof.minimumAge);
// Das tatsächliche Geburtsdatum wird NICHT offengelegt!
```

### 3. Proof verifizieren

```typescript
import { Verifier } from '@muka-dev/check';

// Verifizierer (z.B. Online-Shop, Dienst) prüft den Beweis
const verifier = new Verifier([issuer.getPublicConfig()]);

const result = verifier.verify(ageProof);

if (result.isValid) {
  console.log('✓ Nutzer ist über', result.minimumAge, 'Jahre alt');
  // Zugriff gewähren
} else {
  console.log('✗ Verifikation fehlgeschlagen:', result.error);
  // Zugriff verweigern
}
```

## 🔐 Sicherheits- und Datenschutzgarantien

### Was wird NICHT offengelegt:

- ❌ Geburtsdatum
- ❌ Exaktes Alter
- ❌ Name oder Identität (optional anonym)
- ❌ Weitere personenbezogene Daten

### Was wird bewiesen:

- ✅ "Nutzer ist über X Jahre alt" (nur das Mindestalter)
- ✅ Credential wurde von vertrauenswürdiger Stelle ausgestellt
- ✅ Credential ist gültig und nicht abgelaufen

### Unlinkability (Verkettungsschutz):

Jeder generierte Beweis verwendet einen einzigartigen kryptographischen Commitment. Selbst bei mehrfacher Verwendung durch denselben Nutzer können die Beweise nicht miteinander verknüpft werden. Dies schützt die Privatsphäre und verhindert Tracking.

## 📖 API-Dokumentation

### `CredentialIssuer`

Vertrauenswürdige Stelle zur Ausstellung von Alters-Credentials.

```typescript
const issuer = new CredentialIssuer({
  id: 'issuer-id',
  name: 'Issuer Name',
  publicKey: 'public-key-hex',
  privateKey: 'private-key-hex',
});

const credential = issuer.issueCredential({
  dateOfBirth: new Date('1990-01-01'),
});
```

### `ProofGenerator`

Generiert Zero-Knowledge-Proofs für Altersverifikation.

```typescript
const proofGenerator = new ProofGenerator();

const proof = proofGenerator.generateProof({
  credential: credential,
  minimumAge: 18,
  verificationDate: new Date(), // Optional, Standard: jetzt
});
```

### `Verifier`

Verifiziert Zero-Knowledge-Proofs.

```typescript
const verifier = new Verifier([issuerPublicConfig1, issuerPublicConfig2]);

// Weitere Issuer hinzufügen
verifier.addTrustedIssuer(issuerPublicConfig3);

// Proof prüfen
const result = verifier.verify(proof);
console.log(result.isValid); // true/false
```

## 🎓 Beispiele

Siehe `src/examples.ts` für vollständige Beispiele:

```bash
npm install
npm run build
node -r ./dist/examples.js
```

### Mehrere Altersschwellen

```typescript
const thresholds = [13, 16, 18, 21];

thresholds.forEach(age => {
  try {
    const proof = proofGenerator.generateProof({
      credential,
      minimumAge: age,
    });
    const result = verifier.verify(proof);
    console.log(`Alter ${age}: ${result.isValid ? '✓' : '✗'}`);
  } catch (error) {
    console.log(`Alter ${age}: ✗ (nicht erfüllt)`);
  }
});
```

## 🧪 Tests ausführen

```bash
npm test
```

## 🏗️ Entwicklung

```bash
# Dependencies installieren
npm install

# TypeScript kompilieren
npm run build

# Tests ausführen
npm test

# Code formatieren
npm run format
```

## 🔬 Technische Details

### Kryptographische Grundlagen

Das System basiert auf:

- **Hash-basierte Commitments**: Sichere Bindung an Werte ohne Offenlegung
- **Blinding Factors**: Gewährleistung der Unlinkability zwischen Proofs
- **Digitale Signaturen**: Authentifizierung der Credential-Aussteller
- **Zero-Knowledge-Proofs**: Beweise ohne Informationsoffenlegung

### Architektur

```
┌─────────────────┐
│ Trusted Issuer  │ (Behörde, ID-Provider)
│ - Stellt Credentials aus
│ - Signiert mit privatem Schlüssel
└────────┬────────┘
         │
         │ 1. Credential ausstellen
         ▼
┌─────────────────┐
│  User (Holder)  │
│ - Speichert Credential (inkl. Geburtsdatum)
│ - Generiert Zero-Knowledge-Proofs
└────────┬────────┘
         │
         │ 2. Proof generieren
         ▼
┌─────────────────┐
│   Verifier      │ (Service, Website, App)
│ - Prüft Proof
│ - Lernt nur: "über X Jahre"
└─────────────────┘
```

### Interoperabilität

Die Datenstrukturen sind so gestaltet, dass sie einfach in andere Systeme integriert werden können:

- JSON-kompatible Datentypen
- Klare Schnittstellen
- Erweiterbare Credential-Formate
- Unterstützung mehrerer Issuer

## 🛣️ Roadmap

- [ ] Integration echter ZK-SNARK-Bibliotheken (z.B. SnarkJS)
- [ ] Blockchain-basierte Issuer-Registry
- [ ] Revocation/Widerruf von Credentials
- [ ] Mobile SDKs (iOS, Android)
- [ ] W3C Verifiable Credentials Unterstützung
- [ ] Biometrische Bindung (optional)

## 🤝 Beitragen

Contributions sind willkommen! Bitte erstelle ein Issue oder Pull Request.

## 📄 Lizenz

MIT License - siehe LICENSE-Datei für Details.

## 🔗 Links

- **GitHub**: https://github.com/muka-dev/check
- **npm**: https://www.npmjs.com/package/@muka-dev/check

## ⚠️ Hinweis

Dies ist eine Referenzimplementierung. Für Produktivumgebungen empfehlen wir:

1. Audit durch Kryptographie-Experten
2. Verwendung etablierter ZK-SNARK-Bibliotheken
3. Sichere Schlüsselverwaltung (HSM, Key Management Services)
4. Regelmäßige Security-Updates

---

**Built with ❤️ for privacy and security**
