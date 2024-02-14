const axios = require('axios')
const readline = require('readline');
const moment = require('moment')
const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs-extra')
const URL = require('url').URL
require('colors')



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Masukkan URL awal: ', (url) => {
  const startUrl = url;
  console.log('URL awal:', startUrl);
  rl.close();
});

/**
 * Global variables
 */

const visitedUrls = new Set()

/**
 * @description: empty file function
 */
const initFile = () => new Promise(async (resolve, reject) => {
  const filePath = path.join(__dirname, 'data.txt')
  try {
    await fs.unlinkSync(filePath)
    resolve(true)
  } catch (err) { }
  await fs.writeFileSync(filePath, '')
  resolve(true)
})

/**
 * @param {*} data 
 * @description: save result to file function
 */
const saveResultToFile = (data) => new Promise(async (resolve, reject) => {
  const filePath = path.join(__dirname, 'data.txt')
  await fs.appendFileSync(filePath, `${data}\n`)
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
      const notImages = !(absoluteLink.match(/\.(jpeg|jpg|gif|png|svg)$/))
      if (shouldLink && notImages && !(visitedUrls.has(absoluteLink))) {
        crawlWebsite(absoluteLink, depth + 1)
      }
    }
    await saveResultToFile(url)
    console.log(`[${moment().format('HH:mm:ss')}] Visited: ${url}`)
  } catch (error) {
    console.error(`[${moment().format('HH:mm:ss')}] Failed to fetch ${url}: ${error.message}`.red)
  }
})

/**
 * @param {*} url
 * @description: run function
 */
const run = async (url) => {
  try {
    await initFile()
    await crawlWebsite(url)
  } catch (error) {
    console.error(`[${moment().format('HH:mm:ss')}] Failed to fetch ${url}: ${error.message}`.red)
  }
}

run(startUrl)
