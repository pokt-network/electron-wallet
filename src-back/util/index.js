const fs = require('fs-extra');
const path = require('path');
const { createLogger, format, transports } = require('winston');

/**
 * Reads the contents of package.json
 * @returns {Promise<Object>}
 */
module.exports.getPackageJson = () => {
  const packageJsonPath = path.resolve(__dirname, '../../package.json');
  return fs.readJson(packageJsonPath);
};

/**
 * Creates a Winston Logger instance
 * @param {string} logFilePath
 * @param {boolean} logToConsole
 * @returns {Logger}
 */
module.exports.createLogger = (logFilePath = '', logToConsole = false) => {
  const transports = [];
  if(logFilePath)
    transports.push(new transports.File({
      filename: logFilePath,
      maxsize: 2 * 1024000, // 2MB
      maxFiles: 1,
      tailable: true,
    }));
  if(logToConsole)
    transports.push(new transports.Console());
  return createLogger({
    format: format.combine(
      format.timestamp(),
      format.simple()
    ),
    transports,
  });
};
