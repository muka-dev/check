/**
 * Application Configuration
 */
export interface IAppConfig {
  port: number;
  environment: string;
  defaultVerificationValidityMs: number;
  defaultMinimumAge: number;
  blockchain: {
    rpcUrl: string;
    privateKey: string;
    registryAddress: string;
  };
}

export const config: IAppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  defaultVerificationValidityMs: 90 * 24 * 60 * 60 * 1000, // 90 days
  defaultMinimumAge: 18,
  blockchain: {
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545',
    privateKey:
      process.env.BLOCKCHAIN_PRIVATE_KEY ||
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // Hardhat Account #0
    registryAddress: process.env.BLOCKCHAIN_REGISTRY_ADDRESS || '',
  },
};
