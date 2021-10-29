const fs = require('fs-extra');
const path = require('path');

module.exports.getPackageJson = () => {
  const packageJsonPath = path.resolve(__dirname, '../../package.json');
  return fs.readJson(packageJsonPath);
};
