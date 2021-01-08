module.exports = {
  /**
   * @dev Used to get daily price data of CMC's top 100 "Cryptocurrencies"
   * @param {string[]} _url 
   * @param {package} _puppeteer 
   * @param {package} _fs 
   */
  getAndSaveCryptocurrenciesData:
    async (_url, _puppeteer, _fs) => {
      const browser = await _puppeteer.launch({
        headless: false,
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
      })

      try {
        const page = await browser.newPage()

        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
        await page.setViewport({ width: 1124, height: 1100 })
        await page.goto(_url, { waitUntil: "load", timeout: 0 })

        let currencyURLs = await page.evaluate(() => {

          // Extract rows
          let rows = document.querySelectorAll('table tr')

          return Array.from(rows, row => {
            const columns = row.querySelectorAll('td')

            return Array.from(columns, column => column.innerHTML)
          })
        })

        let cryptoSymbols = []

        for (let i = 0; i < currencyURLs.length; i++) {
          anchorTag = currencyURLs[ i ][ 2 ]

          if (anchorTag != undefined) {
            // Get currencySymbols
            symbolStartIndex = anchorTag.includes('coin-item-symbol')
              ? anchorTag.indexOf('coin-item-symbol') : anchorTag.indexOf('crypto-symbol')

            symbolEndIndex = anchorTag.includes('coin-item-symbol')
              ? anchorTag.indexOf('</p></div></div>') : anchorTag.indexOf('</span></a>')

            symbol = anchorTag.includes('coin-item-symbol')
              ? anchorTag.slice(
                symbolStartIndex + 'coin-item-symbol'.length - 1 + 17,
                symbolEndIndex
              ) : anchorTag.slice(
                symbolStartIndex + 'crypto-symbol'.length + 2,
                symbolEndIndex
              )
            cryptoSymbols.push(symbol.toLowerCase())

            // Get currency URLs
            nameStartIndex = anchorTag.indexOf('/currencies/')
            nameEndIndex = anchorTag.indexOf('class="cmc-link">') - 2

            currencyURLs[ i ] = anchorTag.slice(nameStartIndex, nameEndIndex)
          }
        }

        currencyURLs = currencyURLs.splice(1)


        // Get data for each cryptocurrency in top 100 and save to JSON file.
        for (let z = 0; z < cryptoSymbols.length; z++) {
          if (typeof currencyURLs[ z ] !== 'string') {
            console.log("A galactic jukebox is juking in the distance 🎵👾🪐🕺...")
          } else {

            // Reset headers
            await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
            await page.goto(_url, { waitUntil: "load", timeout: 1000 * 60 * 3 })

            currencyURL = currencyURLs[ z ]

            /** 
             * @notice Wait 3 minutes max for any wait function
             */

            // Click on currency/asset
            await page.waitForSelector(`a[href="${currencyURL}"]`, { timeout: 1000 * 60 * 3 }) // should be something like `bitcoin`
            await page.click(`a[href="${currencyURL}"]`) // should be something like `btc-usd`

            // Click on currency's/asset's historical data
            await page.waitForSelector(`a[href="${currencyURL}historical-data/"]`, { timeout: 1000 * 60 * 3 })
            await page.click(`a[href="${currencyURL}historical-data/"]`)

            // Click on currency's/asset's "Date Range"
            await page.waitForSelector('button[class="sc-1ejyco6-0 gQqumm"]', { timeout: 1000 * 60 * 3 })
            await page.click('button[class="sc-1ejyco6-0 gQqumm"]')


            await page.waitForSelector('button[class="react-datepicker__navigation react-datepicker__navigation--previous"]', { timeout: 0 })

            // Need to click 11 times, then 12 * 7 times
            let i = 0
            while (i < 100) {
              await page.click('button[class="react-datepicker__navigation react-datepicker__navigation--previous"]')
              i++
            }

            // Click on day
            await page.waitForSelector('div[aria-label="Choose Sunday, July 1st, 2012"]')
            await page.click('div[aria-label="Choose Sunday, July 1st, 2012"]')

            // Click "Done"
            await page.waitForSelector('button[class="sc-1ejyco6-0 czBWYA"]')
            await page.click('button[class="sc-1ejyco6-0 czBWYA"]', { delay: 100 })

            // Wait for data to load
            await page.waitForTimeout(3000)

            const headers = await page.evaluate(() => {
              let keys = []
              let headers = document.querySelectorAll('th[class="stickyTop"]')

              const headersParsed = Array.from(headers, header => {
                return header.innerText
              })

              headers = headersParsed.slice(9)

              for (let i = 0; i < headers.length; i++) {
                if (headers[ i ].indexOf('*') != -1) {
                  headers[ i ] = headers[ i ].replace('*', '')
                  if (headers[ i ].indexOf('*') != -1) {
                    headers[ i ] = headers[ i ].replace('*', '')
                  }
                }
                if (headers[ i ].indexOf(' ') != -1) {
                  headers[ i ] = headers[ i ].replace(' ', '')
                }
              }

              for (let i = 0; i < headers.length; i++) {
                keys.push(headers[ i ])
              }

              return keys
            })

            // Extract data from table on page
            const data = await page.evaluate(() => {

              // Extract rows
              let rows = document.querySelectorAll('table tr')

              return Array.from(rows, row => {
                const columns = row.querySelectorAll('td')

                return Array.from(columns, column => column.innerText)
              }).filter(item => item.length == 7)
            })

            let cleanedData = []
            let dataPointForOneDay = {}

            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < data[ i ].length; j++) {
                dataPointForOneDay[ headers[ j ] ] = data[ i ][ j ]
              }
              cleanedData.push(dataPointForOneDay)
            }

            // Save to .json file
            _fs.writeFile(
              `./data/historical-daily-prices/coinmarketcap/Cryptocurrencies/${cryptoSymbols[ z ]}-usd.json`,
              JSON.stringify(cleanedData),
              error => {
                if (error) {
                  console.log('Error writing file', error)
                } else {
                  console.log('Successfully wrote to json file')
                }
              }
            )
          }
        }
      } catch (error) {
        console.error("Click failed because: ", error.message)

      } finally {
        await browser.close()
      }
    }
}