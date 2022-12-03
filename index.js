const http = require('http');
const https = require('https');
const fs = require('fs');

const news = [];

const url = "https://time.com/"

https.get(url, response => {
  let html = '';
  response.on('data', chunk => {
    // Each time we receive a chunk of data, we add it to the 'html' variable
    html += chunk;
  });

  response.on('end', () => {
    // Once the response has ended, we have the complete HTML as a string
    // in the 'html' variable. We can log it to the console to see what it is
    fs.writeFileSync('page.html', html);
    
  });
})

const server = http.createServer((request, response) => {
  if (request.url === '/getTimeStories') {
    // If the request URL is '/getnews', we send the news items as a JSON response
    
    const page = fs.readFileSync('page.html', 'utf-8');

    const aRegex = /<a[^>]*>((.|\s)*?)<\/a>/g; // <-- This regular expression matches a elements and their nested structure
    const aElements = page.match(aRegex);

    for (const element of aElements) {

      // Use the String.match method to find all the h3 elements inside the a element

      //REGEX to extract the href links from a tags
      let hrefRegex = /<a href="(.*?)">/;
      let href = element.match(hrefRegex) ? element.match(hrefRegex)[1] : "" ;


      //REGEX to extract h3 tags
      const h3Regex = /<h3[^>]*>((.|\s)*?)<\/h3>/g;
      const h3Elements = element.match(h3Regex);
    
      //Loop through the list of h3 elements and extract the text
      if (h3Elements !== null && href !== "") {
        for (const h3Element of h3Elements) {
          let textRegex = /<h3 class="[^"]*">(.*?)<\/h3>/;
          let h3Text = h3Element.match(textRegex)[1];

          const cleanedH3Text = h3Text.replace(/^\s+|\s+$/g, '').replace(/<\/?h3>/g, '');
          let obj = {
            title: cleanedH3Text,
            link: href
          }
          news.push(obj)

        }
      }
    }
    console.log("Top stories sent!!")
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(news));
  } else {
    // For any other URL, we send a simple message
    response.write('This is a simple server endpoint');
  }

  response.end();
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
