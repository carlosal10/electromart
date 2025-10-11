const { spawnSync } = require('node:child_process');
const path = require('node:path');

// Ensure nested npm commands reuse the same CLI that invoked this script.
const npmCli = process.env.npm_execpath;

if (!npmCli) {
  console.error('npm_execpath is not defined. Please run this script via npm.');
  process.exit(1);
}

const clientDir = path.join(__dirname, '..', 'client');

const runNpm = (args) => {
  const { status } = spawnSync(process.execPath, [npmCli, ...args], {
    cwd: clientDir,
    stdio: 'inherit',
  });

  if (status !== 0) {
    process.exit(status ?? 1);
  }
};

const action = process.argv[2] ?? 'build';

if (action === 'install') {
  runNpm(['install']);
} else if (action === 'build') {
  runNpm(['install']);
  runNpm(['run', 'build']);
} else {
  console.error(`Unknown action "${action}".`);
  process.exit(1);
}
