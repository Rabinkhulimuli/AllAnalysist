#!/usr/bin/env node
/**
 * Architecture Boundary Validation Script
 *
 * This script validates that Clean Architecture layer boundaries are not violated.
 * It checks import statements to ensure dependencies only flow inward.
 *
 * Layer dependency rules:
 * - Domain: Cannot import from any other layer
 * - Application: Can only import from Domain
 * - Infrastructure: Can import from Domain and Application
 * - Presentation: Can import from Domain and Application
 * - Features: Can import from Domain, Application, and Presentation
 * - Container: Can import from all layers
 * - App (routes): Can only import from Container, Lib, and Config
 */

import fs from 'fs';
import path from 'path';

// eslint-disable-next-line no-console
const echo = message => console.log(message);

const SRC_DIR = path.join(process.cwd(), 'src');

const LAYER_RULES = {
  domain: {
    allowedImports: [],
    forbiddenPatterns: [
      '@/application/',
      '@/infrastructure/',
      '@/presentation/',
      '@/features/',
      '@/container/',
      '@/app/',
      'react',
      'next',
    ],
  },
  application: {
    allowedImports: ['@/domain/'],
    forbiddenPatterns: [
      '@/infrastructure/',
      '@/presentation/',
      '@/features/',
      '@/container/',
      '@/app/',
      'react',
      'next',
    ],
  },
  infrastructure: {
    allowedImports: ['@/domain/', '@/application/', '@/shared/', '@/config/'],
    forbiddenPatterns: ['@/presentation/', '@/features/'],
  },
  presentation: {
    allowedImports: ['@/domain/', '@/application/', '@/shared/', '@/config/'],
    forbiddenPatterns: ['@/infrastructure/', '@/container/'],
  },
  features: {
    allowedImports: [
      '@/domain/',
      '@/application/',
      '@/presentation/',
      '@/shared/',
      '@/config/',
      '@/components/',
    ],
    forbiddenPatterns: ['@/infrastructure/', '@/container/'],
  },
  app: {
    allowedImports: ['@/container/', '@/lib/', '@/config/', '@/domain/'],
    forbiddenPatterns: ['@/infrastructure/', '@/application/'],
  },
};

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

function getLayerFromPath(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);
  const parts = relativePath.split(path.sep);

  if (parts[0] === 'domain') return 'domain';
  if (parts[0] === 'application') return 'application';
  if (parts[0] === 'infrastructure') return 'infrastructure';
  if (parts[0] === 'presentation') return 'presentation';
  if (parts[0] === 'features') return 'features';
  if (parts[0] === 'app') return 'app';
  if (parts[0] === 'container') return null; // Container can import from anywhere

  return null;
}

function extractImports(fileContent) {
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

function validateFile(filePath) {
  const layer = getLayerFromPath(filePath);
  if (!layer || !LAYER_RULES[layer]) {
    return []; // Skip files not in a layer
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const imports = extractImports(content);
  const violations = [];

  const rules = LAYER_RULES[layer];

  imports.forEach(importPath => {
    rules.forbiddenPatterns.forEach(pattern => {
      if (importPath.includes(pattern)) {
        violations.push({
          file: path.relative(process.cwd(), filePath),
          layer,
          import: importPath,
          violation: `${layer} layer cannot import from ${pattern}`,
        });
      }
    });
  });

  return violations;
}

function main() {
  echo('🔍 Validating Clean Architecture boundaries...\n');

  const allFiles = getAllFiles(SRC_DIR);
  const allViolations = [];

  allFiles.forEach(filePath => {
    const violations = validateFile(filePath);
    allViolations.push(...violations);
  });

  if (allViolations.length === 0) {
    echo('✅ All architecture boundaries are valid!\n');
    process.exit(0);
  } else {
    echo(`❌ Found ${allViolations.length} boundary violation(s):\n`);
    allViolations.forEach(v => {
      echo(`  File: ${v.file}`);
      echo(`  Import: ${v.import}`);
      echo(`  Violation: ${v.violation}\n`);
    });
    process.exit(1);
  }
}

main();
