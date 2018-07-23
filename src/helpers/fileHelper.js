const fs = require('fs')
const tmp = require('tmp')
const {
  END_TYPE,
  DATA_TYPE,
  ERROR_TYPE,
  FINISH_TYPE
} = require('../constants')

module.exports = {
  createTmpDirectory,
  readFilesFromDirectory
}

/**
 * This function creates a temp directory where the files are going to be downloaded.
 */
function createTmpDirectory() {
  return new Promise((resolve, reject) => {
    tmp.dir((error, path, cleanupCallback) => {
      if (error) {
        reject(error);
      } else {
        resolve(path);
      }
    });
  });
}

/**
 * This function reads files from specified.
 */
function readFilesFromDirectory(filesDirectory) {
  return new Promise((resolve, reject) => {
    fs.readdir(filesDirectory, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
}
