const puppeteer = require('puppeteer')
const fs = require('fs')
const getAllCryptos = require('./getAllCryptos')
// const getAllDeFi = require('./getAllDeFi')
// const getAllStorage = require('./getAllStorage')

const url = 'https://coinmarketcap.com/'

/**
 * @dev Get historical price data for each of CMC's "Cryptocurrencies", "DeFi",
 * and "Storage" categories.
 */
getAllCryptos.getAndSaveCryptocurrenciesData(url, puppeteer, fs)
// getAllDeFi.getAndSaveDeFiData(url, puppeteer, fs)
// getAllStorage.getAndSaveStorageData(url, puppeteer, fs)