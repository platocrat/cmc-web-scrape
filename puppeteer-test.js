const puppeteer = require('puppeteer')
const fs = require('fs')

const url = 'https://coinmarketcap.com/'; // this semi-colon is needed

/**
 * @dev Testing to figure out optimal action sequence
 */
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
    await page.setViewport({ width: 1024, height: 1000 })
    await page.goto(url)

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

    // Click "Done"
    await page.waitForSelector('button[class="sc-1ejyco6-0 czBWYA"]')
    await page.click('button[class="sc-1ejyco6-0 czBWYA"]', { delay: 500 })

    // Extract data from table
    let jsonFile

    const data = await page.evaluate(() => {
      let headers = document.querySelectorAll('th[class="stickyTop"]')

      const headersParsed = Array.from(headers, header => {
        return header.innerText
      })

      headers = headersParsed.slice(9)

      return headers

      // const rows = document.querySelectorAll('table tr')

      // return Array.from(rows, row => {
      //   const columns = row.querySelectorAll('td')

      //   return Array.from(columns, column => column.innerText)
      // })
    })


    // Save to .json file
    fs.writeFile('./cmc-btc-historical-data.json', JSON.stringify(data), error => {
      if (error) {
        console.log('Error writing file', error)
      } else {
        console.log('Successfully wrote to json file')
      }
    })

  } catch (error) {
    console.error("Click failed because: ", error.message)


  } finally {

    await browser.close()
  }
})();
