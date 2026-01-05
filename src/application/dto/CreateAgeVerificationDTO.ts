/**
 * Data Transfer Object for creating an age verification request
 */
export interface CreateAgeVerificationDTO {
  actualAge: number;
  minimumAge: number;
  secret: string;
  validityDurationMs?: number;
}
