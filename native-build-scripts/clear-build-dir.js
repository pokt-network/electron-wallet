const path = require('path');
const rmrf = require('rmrf-promise');

const buildDir = path.resolve(__dirname, '../build');

(async function() {

  console.log('Clearing build directory\n');

  await rmrf(buildDir);

})();
