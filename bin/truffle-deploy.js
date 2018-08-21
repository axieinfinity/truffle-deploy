#!/usr/bin/env node

if (require.main === module) {
  const { spawnSync } = require('child_process');
  const { join } = require('path');

  const argv = [
    join(__dirname, '../src/deploy.js'),
    ...process.argv.slice(2),
  ];

  const { status } = spawnSync('npx truffle compile && npx truffle exec', argv, {
    stdio: 'inherit',
    shell: true,
  });

  process.exit(status);
}

module.exports = require('../src/deploy');
