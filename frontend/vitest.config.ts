import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'node',
      setupFiles: [
        'src/test/mockEndpoints.ts',
        'src/test/QueryProviderTestWrapper.tsx',
        'src/test/mockLocalStorage.ts',
        'src/test/setupTests.ts',
      ],
    },
  }),
);
