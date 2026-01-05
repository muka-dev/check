import { AgeVerificationService } from './domain/services/AgeVerificationService';
import { CreateAgeVerificationUseCase } from './application/use-cases/CreateAgeVerificationUseCase';
import { VerifyAgeProofUseCase } from './application/use-cases/VerifyAgeProofUseCase';
import { GetAgeVerificationUseCase } from './application/use-cases/GetAgeVerificationUseCase';
import { InMemoryAgeVerificationRepository } from './infrastructure/repositories/InMemoryAgeVerificationRepository';
import { MockCryptographicService } from './infrastructure/services/MockCryptographicService';
import { config } from './infrastructure/config/app.config';

/**
 * Main Application Entry Point
 */
class Application {
  private readonly repository: InMemoryAgeVerificationRepository;
  private readonly cryptoService: MockCryptographicService;
  private readonly domainService: AgeVerificationService;
  private readonly createUseCase: CreateAgeVerificationUseCase;
  private readonly verifyUseCase: VerifyAgeProofUseCase;
  private readonly getUseCase: GetAgeVerificationUseCase;

  constructor() {
    // Initialize dependencies (Dependency Injection)
    this.repository = new InMemoryAgeVerificationRepository();
    this.cryptoService = new MockCryptographicService();
    this.domainService = new AgeVerificationService();

    // Initialize use cases
    this.createUseCase = new CreateAgeVerificationUseCase(
      this.repository,
      this.cryptoService,
      this.domainService,
    );

    this.verifyUseCase = new VerifyAgeProofUseCase(
      this.repository,
      this.cryptoService,
      this.domainService,
    );

    this.getUseCase = new GetAgeVerificationUseCase(this.repository);
  }

  public async start(): Promise<void> {
    console.log('🚀 Age Verification System Starting...');
    console.log(`📋 Environment: ${config.environment}`);
    console.log(`🔧 Configuration loaded`);
    console.log('✅ Clean Architecture initialized');
    console.log('\n📂 Architecture Layers:');
    console.log('   - Domain Layer: Business logic and entities');
    console.log('   - Application Layer: Use cases and orchestration');
    console.log('   - Infrastructure Layer: External implementations');
    console.log('   - Presentation Layer: (To be implemented)');
    console.log('\n✨ System ready for development');

    // Example usage
    await this.runExample();
  }

  private async runExample(): Promise<void> {
    try {
      console.log('\n🧪 Running example age verification...');

      // Create a verification
      const result = await this.createUseCase.execute({
        actualAge: 25,
        minimumAge: 18,
        secret: 'user-secret-key',
      });

      console.log('✅ Verification created:', {
        id: result.id,
        proofHash: result.proofHash.substring(0, 16) + '...',
        minimumAge: result.minimumAge,
        isValid: result.isValid,
      });

      // Verify the proof
      const isValid = await this.verifyUseCase.execute({
        proofHash: result.proofHash,
        minimumAge: 18,
      });

      console.log('🔍 Verification result:', isValid ? '✅ Valid' : '❌ Invalid');

      // Retrieve the verification
      const retrieved = await this.getUseCase.execute(result.id);
      console.log('📄 Retrieved verification:', retrieved ? '✅ Found' : '❌ Not found');
    } catch (error) {
      console.error('❌ Example failed:', error);
    }
  }
}

// Start the application
const app = new Application();
app.start().catch((error) => {
  console.error('💥 Application failed to start:', error);
  process.exit(1);
});
