const fs = require('fs-extra');
const path = require('path');
const rmrf = require('rmrf-promise');

(async function() {

  const clearDirectory = async function(dir) {
    console.log(`Clearing ${dir}\n`);

    await fs.ensureDir(dir);

    const contents = await fs.readdir(dir);

    for(const file of contents) {
      const filePath = path.join(dir, file);
      await rmrf(filePath);
    }

  }

  const dirs = [
    'build',
    'build-native',
  ];
  for(const dir of dirs) {
    await clearDirectory(path.resolve(__dirname, `../${dir}`));
  }

})();
