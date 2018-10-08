const _ = require('lodash')
const nconf = require('nconf')
const moment = require('moment')
const isThere = require('is-there')
const {
  periodsList,
  generateDateArray
} = require('./fiscalCalendarHelper')
const {
  DATE_TYPE,
  REPORT_MODE,
  MOMENT_PERIOD,
  DEFAULT_BUCKET,
  REPORT_SUB_TYPE,
  FINANCE_REGIONS,
  MAXIMUM_INTERVAL,
  DEFAULT_YEAR_MASK,
  REPORT_SALES_TYPE,
  DEFAULT_DATE_MASK,
  REPORT_FINANCIAL_TYPE
} = require('../constants')

module.exports = {
  getConfig,
  parseConfiguration
}

/**
 * This function reads and parse the config passed via args.
 *
 * @param {string} configPath - a path to a configuration.
 * @param {function} fileExist - a simple function that checks whether a file exists .
 * @returns {Object}
 */
function getConfig(configPath, fileExist = isThere) {
  if (fileExist(configPath)) {
    return nconf.env().file(configPath)
  } else {
    return {}
  }
}


/**
 * This function reads verifies the input configuration and returns relevant params.
 *
 * @param {Object} configObject - nconf object with the input configuration.
 * @throws {error}
 * @returns {Object}
 */
function parseConfiguration(configObject = {}) {
  try {
    const accessToken = configObject.get('parameters:#accessToken');
    if (_.isUndefined(accessToken) || _.isEmpty(accessToken)) {
      throw new Error('Parameter #accessToken is not defined! Please check out the documentation for more information.');
    }

    const reportType = configObject.get('parameters:reportType');
    if (_.isUndefined(reportType) || _.isEmpty(reportType)) {
      throw new Error('Parameter reportType is not defined! Please check out the documentation for more information.');
    }
    const account = configObject.get('parameters:account');
    if (_.isUndefined(account) || _.isEmpty(account)) {
      throw new Error('Parameter account is not defined! Please check out the documentation for more information.');
    }
    // Read array of vendors ids.
    const vendors = configObject.get('parameters:vendors');
    if (_.isUndefined(vendors) || _.isEmpty(vendors)) {
      throw new Error('Parameter vendors is not defined! Please check out the documentation for more information.');
    }
    if (!_.isArray(vendors)) {
      throw new Error('Parameter vendors must be an array including vendors (even when there is just one)! Please check out the documentation for more information.');
    }

    // Compare whether the reportType is either REPORT_SALES_TYPE or REPORT_FINANCIAL_TYPE.
    if (!_.includes([REPORT_SALES_TYPE, REPORT_FINANCIAL_TYPE], reportType.toLowerCase())) {
      throw new Error(`Parameter reportType has invalid value. Please specify either ${REPORT_SALES_TYPE} or ${REPORT_FINANCIAL_TYPE}!`);
    }

    // Another important step is to set the date range properly.
    const maximalDate = moment.utc().subtract(1, MOMENT_PERIOD).format(DEFAULT_DATE_MASK);
    const defaultStartDate = moment.utc().subtract(5, MOMENT_PERIOD).format(DEFAULT_DATE_MASK);
    const startDate = !_.isUndefined(configObject.get('parameters:startDate')) && !_.isEmpty(configObject.get('parameters:startDate'))
      ? configObject.get('parameters:startDate')
      : defaultStartDate;

    const endDate = !_.isUndefined(configObject.get('parameters:endDate')) && !_.isEmpty(configObject.get('parameters:endDate'))
      ? configObject.get('parameters:endDate')
      : maximalDate;

    // Verify whether the format of the startDate and endDate is correct.
    if (moment(startDate)._f !== DEFAULT_DATE_MASK) {
      throw new Error(`Invalid date mask set for parameter 'startDate'. Please set the value to ${DEFAULT_DATE_MASK}`);
    }
    if (moment(endDate)._f !== DEFAULT_DATE_MASK) {
      throw new Error(`Invalid date mask set for parameter 'endDate'. Please set the value to ${DEFAULT_DATE_MASK}`);
    }
    // Verify whether an input date are inserted in proper order.
    if (moment(endDate, DEFAULT_DATE_MASK).diff(moment(startDate, DEFAULT_DATE_MASK)) < 0) {
      throw new Error(`Parameter endDate ${endDate} is older than or equal to startDate ${startDate}! Please check out the documentation for more information.`);
    }
    // Verify whether endDate is not older than today() - 1.
    if (moment(endDate, DEFAULT_DATE_MASK).diff(maximalDate) > 0) {
      throw new Error(`Parameter endDate ${endDate} is bigger than maximal allowed date value ${maximalDate}! Please check out the documentation for more information.`);
    }
    // Generate some dates for earnings data
    const currentYear = moment().format(DEFAULT_YEAR_MASK);
    const nextYear = moment().add(1, 'years').format(DEFAULT_YEAR_MASK);
    // This generates the array of dates.

    const dates = generateDateArray(startDate, endDate);
    if (reportType.toLowerCase() === REPORT_SALES_TYPE && _.size(dates) > MAXIMUM_INTERVAL) {
      throw new Error(`The selected interval is too big! Keep the date range lower than ${MAXIMUM_INTERVAL}!`);
    }

    // This is for fiscal dimensions.
    const periods = _.uniq(_.flatten(periodsList(currentYear, nextYear, dates)));

    return {
      accessToken,
      account,
      vendors,
      startDate,
      endDate,
      dates,
      periods,
      mode: REPORT_MODE,
      dateType: DATE_TYPE,
      regions: FINANCE_REGIONS,
      reportSubType: REPORT_SUB_TYPE,
      reportType: reportType.toLowerCase(),
      fileName: `${reportType.toLowerCase()}.csv`
    }
  } catch (error) {
    throw new Error(`Problem in the input configuration - ${error.message}`)
  }
}
