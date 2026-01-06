import { CreateAgeVerificationUseCase } from '../CreateAgeVerificationUseCase';
import { InMemoryAgeVerificationRepository } from '../../../infrastructure/repositories/InMemoryAgeVerificationRepository';
import { MockCryptographicService } from '../../../infrastructure/services/MockCryptographicService';
import { AgeVerificationService } from '../../../domain/services/AgeVerificationService';

describe('CreateAgeVerificationUseCase', () => {
  let useCase: CreateAgeVerificationUseCase;
  let repository: InMemoryAgeVerificationRepository;
  let cryptoService: MockCryptographicService;
  let domainService: AgeVerificationService;

  beforeEach(() => {
    repository = new InMemoryAgeVerificationRepository();
    cryptoService = new MockCryptographicService();
    domainService = new AgeVerificationService();
    useCase = new CreateAgeVerificationUseCase(repository, cryptoService, domainService);
  });

  describe('execute', () => {
    it('should create a valid age verification', async () => {
      const result = await useCase.execute({
        actualAge: 25,
        minimumAge: 18,
        secret: 'test-secret',
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.proofHash).toBeDefined();
      expect(result.minimumAge).toBe(18);
      expect(result.isValid).toBe(true);
      expect(result.isRevoked).toBe(false);
    });

    it('should throw error when actual age is below minimum', async () => {
      await expect(
        useCase.execute({
          actualAge: 16,
          minimumAge: 18,
          secret: 'test-secret',
        }),
      ).rejects.toThrow('Actual age does not meet minimum age requirement');
    });

    it('should throw error for duplicate proof', async () => {
      const dto = {
        actualAge: 25,
        minimumAge: 18,
        secret: 'test-secret',
      };

      await useCase.execute(dto);

      await expect(useCase.execute(dto)).rejects.toThrow('Proof already exists');
    });

    it('should create verification with custom validity duration', async () => {
      const customDuration = 30 * 24 * 60 * 60 * 1000; // 30 days

      const result = await useCase.execute({
        actualAge: 25,
        minimumAge: 18,
        secret: 'test-secret',
        validityDurationMs: customDuration,
      });

      expect(result).toBeDefined();
      expect(result.isValid).toBe(true);
    });

    it('should store verification in repository', async () => {
      const result = await useCase.execute({
        actualAge: 25,
        minimumAge: 18,
        secret: 'test-secret',
      });

      const stored = await repository.findById(result.id);
      expect(stored).toBeDefined();
      expect(stored?.getId()).toBe(result.id);
    });
  });
});
