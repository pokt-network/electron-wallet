const path = require('path');
const rmrf = require('rmrf-promise');

const buildDir = path.resolve(__dirname, '../build');

(async function() {

  console.log('Clearing build directory');

  await rmrf(buildDir);

})();
