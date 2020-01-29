const puppeteer = require('puppeteer')
const fs = require('fs')

;(async () => {
  try {
    const browser = await puppeteer.launch()
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()
    await page.goto('https://github.com/trending')
    await page.setCacheEnabled(false)
    await page.reload()
    await page.waitForSelector('div.f6.text-gray.mt-2')

    const data = await page.evaluate(() => {
      const temp = []
      const starElem = document.querySelectorAll('div.f6.text-gray.mt-2')
      starElem.forEach((c1) => {
        let language = 'unspecific'
        let stars = 0
        for(let i = 1; i < c1.childNodes.length; i++) {
          const node = c1.childNodes[i]
          switch (node.className) {
            case 'd-inline-block ml-0 mr-3':
              language = node.innerText
              break
            case 'd-inline-block float-sm-right':
              stars = node.innerText
              break
            default:
              break
          }
        }
        temp.push({language, stars})
      })
      return temp
    })
    console.log(data)
    await browser.close()

    fs.writeFile('data.json', JSON.stringify(data), (err) => {
      if (err) throw err
    })

  } catch (err) { console.error(err) }
})()