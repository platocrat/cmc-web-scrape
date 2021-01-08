/**
 * ----------------------------------------------------------------------------- 
 * @todo THIS FILE IS INCOMPLETE - REFER TO `getAllCryptos.js` TO IMPLEMENT
 * COMPLETE THIS FILE
 * -----------------------------------------------------------------------------
 */

module.exports = {
  /**
   * @dev Used to get daily price data of CMC's top 100 "DeFi" assets
   * @param {string[]} _url 
   * @param {package} _puppeteer 
   * @param {package} _fs 
   */
  getAndSaveDeFiData:
    async (_url, _puppeteer, _fs) => {
      const browser = await _puppeteer.launch({
        headless: false,
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
      })
    }