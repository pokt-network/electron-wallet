const fs = require('fs-extra');
const path = require('path');
const rmrf = require('rmrf-promise');
const omit = require('lodash/omit');
const {ensureDir} = require("fs-extra");

(async function() {

  const filesToCopy = [
    'package.json',
    'public',
    'build',
    'src-back',
  ];

  console.log('Clearing temp directory\n');

  const tempDir = path.resolve(__dirname, '../temp');

  await rmrf(tempDir);
  await ensureDir(tempDir)

  for(const file of filesToCopy) {
    const filePath = path.resolve(__dirname, '..', file);
    const destination = path.join(tempDir, file);

    console.log(`Copying ${filePath} > ${destination}`);

    if(file === 'package.json') {
      const packageJson = await fs.readJSON(filePath);
      await fs.writeJSON(destination, omit(packageJson, ['build']), {spaces: 2});
    } else {
      await fs.copy(filePath, destination);
    }
  }

  console.log('');

})();


