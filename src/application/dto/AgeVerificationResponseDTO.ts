/**
 * Data Transfer Object for age verification response
 */
export interface AgeVerificationResponseDTO {
  id: string;
  proofHash: string;
  minimumAge: number;
  timestamp: string;
  expiresAt: string;
  isValid: boolean;
  isRevoked: boolean;
}
