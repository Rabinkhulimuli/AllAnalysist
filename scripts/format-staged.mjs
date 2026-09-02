#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const PRETTIER_BATCH_SIZE = 40;

const ALLOWED_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.md',
  '.css',
  '.scss',
]);

const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const chunk = (items, size) => {
  const batches = [];

  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }

  return batches;
};

const stagedFilesResult = spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], {
  encoding: 'utf-8',
  shell: process.platform === 'win32',
});

if (stagedFilesResult.status !== 0) {
  process.exit(stagedFilesResult.status ?? 1);
}

const stagedFiles = stagedFilesResult.stdout
  .split(/\r?\n/)
  .map(file => file.trim())
  .filter(Boolean)
  .filter(file => {
    const ext = file.slice(file.lastIndexOf('.'));
    return ALLOWED_EXTENSIONS.has(ext);
  });

if (stagedFiles.length === 0) {
  // eslint-disable-next-line no-console
  console.log('No staged files matched formatting extensions.');
  process.exit(0);
}

for (const batch of chunk(stagedFiles, PRETTIER_BATCH_SIZE)) {
  run('pnpm', ['exec', 'prettier', '--write', ...batch]);
}

for (const batch of chunk(stagedFiles, PRETTIER_BATCH_SIZE)) {
  run('git', ['add', ...batch]);
}

// eslint-disable-next-line no-console
console.log(`Formatted and re-staged ${stagedFiles.length} file(s).`);
