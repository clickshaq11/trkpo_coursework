import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: [
        "src/test/integration/*"
      ],
      globals: true,
      environment: 'jsdom',
      setupFiles: [
        'src/test/unit/mockEndpoints.ts',
        'src/test/unit/QueryProviderTestWrapper.tsx',
        'src/test/unit/mockLocalStorage.ts',
        'src/test/unit/setupTests.ts',
      ],
      reporters: process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default'],
    },
  }),
);
