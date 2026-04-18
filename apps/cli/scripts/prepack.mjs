#!/usr/bin/env node
// Stages README, LICENSE, and the portable hook stubs into apps/cli/ so the
// `files` allowlist in package.json picks them up. Runs automatically as a
// `prepack` lifecycle script for both `npm pack` and `npm publish` (and
// therefore for `changeset publish` too).
import { cpSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cliRoot = resolve(here, '..');
const repoRoot = resolve(cliRoot, '..', '..');

// `npm prepack` runs not just on pack/publish but also when installing this
// package from a tarball or git url. In those installs the source files don't
// exist (they live at the upstream repo root). If the upstream root doesn't
// look like our monorepo, skip silently.
if (!existsSync(join(repoRoot, 'pnpm-workspace.yaml'))) {
  process.stdout.write('prepack: not in source repo, skipping\n');
  process.exit(0);
}

const items = [
  ['README.md', 'README.md'],
  ['LICENSE', 'LICENSE'],
  ['hooks-scripts', 'hooks-scripts'],
];

for (const [src, dest] of items) {
  const from = join(repoRoot, src);
  if (!existsSync(from)) {
    process.stderr.write(`prepack: missing source ${from}\n`);
    process.exit(1);
  }
  cpSync(from, join(cliRoot, dest), { recursive: true });
}

process.stdout.write('prepack: staged README, LICENSE, hooks-scripts\n');
