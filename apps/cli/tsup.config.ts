import { readFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8')) as { version: string };

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  clean: true,
  sourcemap: false,
  minify: false,
  // No `banner` here. Tsup's banner option applies to every output file
  // (including dynamic-import chunks), and apps/{worker,mcp-server}/src/server.ts
  // already start with their own `#!/usr/bin/env node`. Stacking a second
  // shebang two lines down is invalid ESM and breaks dynamic imports with
  // "Invalid or unexpected token". The shebang we need on the main entry is
  // in src/index.ts itself.
  noExternal: [/^@cavemem\//],
  define: { __CAVEMEM_VERSION__: JSON.stringify(version) },
});
