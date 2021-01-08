const puppeteer = require('puppeteer')
const fs = require('fs')
const getAllCryptos = require('./getAllCryptos')

const cryptoURL = 'https://coinmarketcap.com/'
const defiURL = 'https://coinmarketcap.com/defi'
const storageURL = 'https://coinmarketcap.com/storage'
// const yieldFarmingURL = 'https://coinmarketcap.com/yield-farming'

/**
 * @dev Get historical price data for each of CMC's "Cryptocurrencies", "DeFi",
 * and "Storage" categories.
 */
getAllCryptos.getAndSaveData(cryptoURL, puppeteer, fs)
getAllCryptos.getAndSaveData(defiURL, puppeteer, fs)
getAllCryptos.getAndSaveData(storageURL, puppeteer, fs)

/**
 * @todo Yield farming has subcategories I need to deal with
 */
// getAllCryptos.getAndSaveData(yieldFarmingURL, puppeteer, fs)
