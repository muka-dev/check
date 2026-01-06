/**
 * Application Configuration
 */
export interface IAppConfig {
  port: number;
  environment: string;
  defaultVerificationValidityMs: number;
  defaultMinimumAge: number;
}

export const config: IAppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  defaultVerificationValidityMs: 90 * 24 * 60 * 60 * 1000, // 90 days
  defaultMinimumAge: 18,
};
