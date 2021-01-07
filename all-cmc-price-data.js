const puppeteer = require('puppeteer')
const fs = require('fs')

import { getAndSaveBTC_USD_Data } from './data/daily-historical-prices/coinmarketcap-scripts/btc-usd'

const url = 'https://coinmarketcap.com/'

/**
 * @dev Call all CMC scripts.
 */
getAndSaveBTC_USD_Data(url, puppeteer, fs)
getAndSaveETH_USD_Data(url, puppeteer, fs)