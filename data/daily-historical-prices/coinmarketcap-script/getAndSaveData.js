/**
 * @dev Get BTC/USD data and save locally to
 * `data/daily-historical-prices/coinmarketcap-data/btc-usd.json`
 */
export async function getAndSaveBTC_USD_Data(_url, _puppeteer, _fs) {
  const browser = await _puppeteer.launch({
    headless: false,
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
    await page.setViewport({ width: 1024, height: 1000 })
    await page.goto(_url)

    // Click on Bitcoin
    await page.waitForSelector('a[href="/currencies/bitcoin/"]')
    await page.click('a[href="/currencies/bitcoin/"]', { delay: 500 })

    // Click on Bitcoin's historical data
    await page.waitForSelector('a[href="/currencies/bitcoin/historical-data/"]')
    await page.click('a[href="/currencies/bitcoin/historical-data/"]', { delay: 500 })

    // Click on Bitcoin's "Date Range"
    await page.waitForSelector('button[class="sc-1ejyco6-0 gQqumm"]')
    await page.click('button[class="sc-1ejyco6-0 gQqumm"]', { delay: 500 })


    await page.waitForSelector('button[class="react-datepicker__navigation react-datepicker__navigation--previous"]')

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
    await page.click('button[class="sc-1ejyco6-0 czBWYA"]', { delay: 500 })

    // Wait for data to load
    await page.waitForTimeout(3000)

    const headers = await page.evaluate(() => {
      let keys = {}
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

      return headers
    })

    // console.log(headers)

    // Extract data from table
    const rawDataArray = await page.evaluate(() => {

      // Extract rows
      let rows = document.querySelectorAll('table tr')

      return Array.from(rows, row => {
        const columns = row.querySelectorAll('td')

        return Array.from(columns, column => column.innerText)
      }).filter(item => item.length == 7)
    })

    let cleanedData = []
    let dataPointForOneDay = {}

    for (let i = 0; i < rawDataArray.length; i++) {
      for (let j = 0; j < rawDataArray[ i ].length; i++) {
        dataPointForOneDay[ headers[ j ] ] = rawDataArray[ i ][ j ]
      }
      cleanedData.push(dataPointForOneDay)
    }

    // Save to .json file
    _fs.writeFile(
      './data/daily-historical-prices/coinmarketcap-data/btc-usd.json',
      JSON.stringify(cleanedData),
      error => {
        if (error) {
          console.log('Error writing file', error)
        } else {
          console.log('Successfully wrote to json file')
        }
      }
    )
  } catch (error) {
    console.error("Click failed because: ", error.message)

  } finally {
    await browser.close()
  }
}