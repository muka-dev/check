/**
 * Data Transfer Object for age verification response
 */
export interface IAgeVerificationResponseDTO {
  id: string;
  proofHash: string;
  minimumAge: number;
  timestamp: string;
  expiresAt: string;
  isValid: boolean;
  isRevoked: boolean;
}
