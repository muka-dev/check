/**
 * Data Transfer Object for creating an age verification request
 */
export interface ICreateAgeVerificationDTO {
  actualAge: number;
  minimumAge: number;
  secret: string;
  validityDurationMs?: number;
}
