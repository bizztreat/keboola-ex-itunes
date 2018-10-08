const _ = require('lodash')
const path = require('path')
const rimraf = require('rimraf-promise')
const constants = require('./constants')
const { getConfig, parseConfiguration } = require('./helpers/configHelper')
const { createManifestFile } = require('./helpers/csvHelper')
const { createTmpDirectory, readFilesFromDirectory } = require('./helpers/fileHelper')
const {
   iTunesConnectInit,
   generateReportParams,
   getKeysBasedOnReportType,
   downloadReports,
   uncompressReportFiles,
   getDownloadedReports,
   transferFilesFromSourceToDestination
} = require('./helpers/iTunesHelper')

/**
 * This is the main part of the program.
 */
module.exports = async (dataDir) => {
  const configFile = path.join(dataDir, constants.CONFIG_FILE)
  const tableOutDir = path.join(dataDir, constants.DEFAULT_TABLES_OUT_DIR)

  try {
    // Reading of the input configuration.
    const {
      mode,
      dates,
      account,
      accessToken,
      regions,
      periods,
      vendors,
      endDate,
      fileName,
      dateType,
      startDate,
      reportType,
      reportSubType
    } = parseConfiguration(getConfig(configFile))

    console.log("Version: 2.0.1")
    console.log(`Downloading data between ${startDate} and ${endDate}!`)

    // Prepares table out directory where the files are going to be stored.
    const downloadDir = await createTmpDirectory();
    const reporter = iTunesConnectInit({ accessToken, account, mode, reportType });
    const options = generateReportParams({
      vendors, regions, periods, dates, dateType, reportType, reportSubType
    });
    
    const reports = await Promise.all(downloadReports(reporter, options, downloadDir));

    console.log(reports);
    // We should read the content of the directory where the downloaded files are stored.
    const compressedFiles = await readFilesFromDirectory(downloadDir);
    const files = getDownloadedReports(
      await Promise.all(uncompressReportFiles(downloadDir, compressedFiles))
    );

    console.debug(reporter)
    console.debug("---")
    console.debug("zip files:" + compressedFiles)
    console.debug("files:" + files + " size: " + _.size(files))
    console.debug("---")

    // Check whether the input files exist (if some data was downloaded + written into the files).
    if (_.size(files) > 0) {
      const transferedFiles = await transferFilesFromSourceToDestination(downloadDir, tableOutDir, files, fileName, reportType, getKeysBasedOnReportType(reportType));
      // Create final manifest.
      const manifest = {
         incremental: constants.IS_INCREMENTAL,
         primary_key: constants.PRIMARY_KEY
        }
      await createManifestFile(`${path.join(tableOutDir, fileName)}.manifest`, manifest)
    }
    // Cleaning.
    const cleaning = await rimraf(downloadDir);

    console.log('Extraction completed!')
    process.exit(constants.EXIT_STATUS_SUCCESS)
  } catch (error) {
    console.error(error.message ? error.message : error)
    process.exit(constants.EXIT_STATUS_FAILURE)
  }
}
