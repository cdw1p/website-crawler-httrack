const axios = require('axios')
const moment = require('moment')
const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs-extra')
const URL = require('url').URL
require('colors')

/**
 * Global variables
 */
const startUrl = '' // Your target website
const visitedUrls = new Set()

/**
 * @param {*} data 
 * @description: save result to file function
 */
const saveResultToFile = (data) => new Promise(async (resolve, reject) => {
  const filePath = path.join(__dirname, 'data.txt')
  await fs.writeFileSync(filePath, data, 'utf8')
  resolve(true)
})

/**
 * @param {*} url 
 * @param {*} depth
 * @description: crawl website function 
 */
const crawlWebsite = (url, depth = 0) => new Promise(async (resolve, reject) => {
  if (depth > 3) return
  if (visitedUrls.has(url)) return
  visitedUrls.add(url)
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const links = $('a').map((i, link) => $(link).attr('href')).get()
    for (let link of links) {
      const absoluteLink = (new URL(link, url).href).split('#')[0]
      const shouldLink = (new URL(absoluteLink)).origin === (new URL(url)).origin
      if (shouldLink && !(visitedUrls.has(absoluteLink))) {
        crawlWebsite(absoluteLink, depth + 1)
      }
    }
    console.log(`[${moment().format('HH:mm:ss')}] Visited: ${url}`)
  } catch (error) {
    console.error(`[${moment().format('HH:mm:ss')}] Failed to fetch ${url}: ${error.message}`.red)
  }
  resolve(true)
})

/**
 * @param {*} url
 * @description: run function
 */
const run = async (url) => {
  try {
    await crawlWebsite(url)
    await saveResultToFile(Array.from(visitedUrls).join('\n'))
  } catch (error) {
    console.error(`[${moment().format('HH:mm:ss')}] Failed to fetch ${url}: ${error.message}`.red)
  }
}

run(startUrl)