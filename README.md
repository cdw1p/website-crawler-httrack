# Website Crawler with HTTrack

This is a simple website crawler built with Node.js. It crawls a website starting from a given URL and saves the visited URLs to a file.

## Installation

1. Clone this repository:
```
git clone https://github.com/shidiqmuh0/website-crawler-httrack.git
```

2. Navigate to the project directory:
```
cd website-crawler-httrack
```

3. Install dependencies:
```
npm install
```

## Usage

1. Run the crawler:
```
node index.js
```

2. Follow the prompt and enter the starting URL when asked.

3. The crawler will then start crawling the website, and the visited URLs will be saved to a file named data.txt in the project directory.

## Dependencies

* axios: "^1.6.7"
* cheerio: "^1.0.0-rc.12"
* colors: "^1.4.0"
* fs-extra: "^11.2.0"
* moment: "^2.30.1"
* url: "^0.11.3"
* readline: "^1.4.0"
