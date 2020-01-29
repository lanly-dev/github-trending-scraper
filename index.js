const playwright = require('playwright')
const fs = require('fs')

;(async () => {
  try {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
      const browser = await playwright[browserType].launch()
      const context = await browser.newContext()
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
      await page.screenshot({ path: `example-${browserType}.png` })
      await browser.close()

      fs.writeFile('data.json', JSON.stringify(data), (err) => {
        if (err) throw err
      })
    }
  } catch (err) { console.error(err) }
})()