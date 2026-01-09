/* eslint-disable no-console */
import app from './presentation/api/app';
import { config } from './infrastructure/config/app.config';

/**
 * Main Application Entry Point
 * Starts the Express Server
 */
const startServer = async (): Promise<void> => {
  try {
    const port = config.port;

    app.listen(port, (): void => {
      console.log('\n🚀 Age Verification System API is running!');
      console.log(`📋 Environment: ${config.environment}`);
      console.log(`✅ Server running on http://localhost:${port}`);
      console.log(`🩺 Health check: http://localhost:${port}/health`);
      console.log(`🔗 API Base: http://localhost:${port}/api/v1/age-verification`);

      console.log('\n📂 Architecture Layers Active:');
      console.log('   - Domain Layer: Business rules loaded');
      console.log('   - Application Layer: Use cases ready');
      console.log(
        '   - Infrastructure Layer: ZK-SNARKs Service (with Simulation Fallback) connected',
      );
      console.log('   - Presentation Layer: REST API accepting requests');
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();
