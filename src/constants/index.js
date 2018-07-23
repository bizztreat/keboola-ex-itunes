// This file contains default constants of the application.
module.exports = {
  CONFIG_FILE: 'config.json',
  DEFAULT_DATA_DIR: '/data',
  DEFAULT_TABLES_IN_DIR: '/in/tables',
  DEFAULT_TABLES_OUT_DIR: '/out/tables',
  EXIT_STATUS_SUCCESS: 0,
  EXIT_STATUS_FAILURE: 1,
  REPORT_SALES_TYPE: 'sales',
  REPORT_FINANCIAL_TYPE: 'financial',
  IS_INCREMENTAL: true,
  DATE_TYPE: 'Daily',
  REPORT_MODE: 'Robot.XML',
  PRIMARY_KEY: ['id'],
  REPORT_SUB_TYPE: 'Summary',
  FINANCE_REGIONS: [
    "AE", "AU", "CA", "CH", "DK", "EU", "GB", "HK",
    "ID", "IL", "IN", "JP", "MX", "NO", "NZ", "RU",
    "SA", "SE", "SG", "TR", "TW", "US", "WW", "ZA"
  ],
  SALES_KEYS: [
    "Provider", "Provider Country", "Vendor Identifier", "Artist / Show", "Title",
    "Label/Studio/Network", "Product Type Identifier", "Begin Date", "End Date",
    "Customer Currency", "Country Code", "Royalty Currency", "Apple Identifier",
    "Asset/Content Flavor", "Vendor Offer Code", "Primary Genre"
  ],
  EARNINGS_KEYS: [
    "Start Date", "End Date", "Vendor Identifier",
    "Partner Share Currency", "Sales or Return",
    "Apple Identifier", "Product Type Identifier",
    "Title", "Country Of Sale", "Customer Currency"
  ],
  MAXIMUM_INTERVAL: 60,
  INITIAL_PERIOD: 9,
  ENOTFOUND: 'ENOTFOUND',
  ECONNRESET: 'ECONNRESET',
  Z_DATA_ERROR: 'Z_DATA_ERROR',
  DATASET_EMPTY: 'DATASET_EMPTY',
  DEFAULT_DATE_MASK: 'YYYYMMDD',
  DEFAULT_YEAR_MASK: 'YYYY',
  MOMENT_PERIOD: 'days',
  RESPONSE_TYPE: 'response',
  DATA_TYPE: 'data',
  ERROR_TYPE: 'error',
  END_TYPE: 'end',
  FINISH_TYPE: 'finish',
  DEFAULT_BUCKET: 'in.c-ex-itunes',
  CONNECTION_ERROR: 'Problem with connection to iTunes Connect! Please try it again!'
}