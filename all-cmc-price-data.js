const puppeteer = require('puppeteer')
const fs = require('fs')
const cmcScript = require('./data/daily-historical-prices/coinmarketcap-script/cmcScript')

const url = 'https://coinmarketcap.com/'

/**
 * @dev Get CMC from specified coins. 
 * @todo Automate the process of selecting/getting the coin name and 
 * ticker symbol.
 */
// cmcScript.getAndSaveData(url, puppeteer, fs, "bitcoin", "btc-usd") // BTC/USD
cmcScript.getAndSaveData(url, puppeteer, fs, "ethereum", "eth-usd") // ETH/USD
// cmcScript.getAndSaveData(url, puppeteer, fs, "bitcoin-cash", "bch-usd") // BCH/USD
// cmcScript.getAndSaveData(url, puppeteer, fs, "polkadot-new", "dot-usd") // DOT/USD
// cmcScript.getAndSaveData(url, puppeteer, fs, "binance-coin", "bnb-usd") // BNB/USD
// cmcScript.getAndSaveData(url, puppeteer, fs, "chainlink", "link-usd") // LINK/USD
// cmcScript.getAndSaveData(url, puppeteer, fs, "usd-coin", "usdc-usd") // USDC/USD
// cmcScript.getAndSaveData(url, puppeteer, fs, "uniswap", "uni-usd") // UNI/USD
// cmcScript.getAndSaveData(url, puppeteer, fs, "aave", "aave-usd") // AAVE/USD