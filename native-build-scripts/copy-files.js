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

  const tempDir = path.resolve(__dirname, '../temp');

  await rmrf(tempDir);
  await ensureDir(tempDir)

  for(const file of filesToCopy) {
    const filePath = path.resolve(__dirname, '..', file);
    const destination = path.join(tempDir, file);
    if(file === 'package.json') {
      const packageJson = await fs.readJSON(filePath);
      await fs.writeJSON(destination, omit(packageJson, ['build']), {spaces: 2});
    } else {
      await fs.copy(filePath, destination);
    }
  }

})();


