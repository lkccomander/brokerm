const fs = require('fs');
const path = require('path');
const https = require('https');

const dirPath = 'C:/Projects/brokermike/landingpage/src/pages';
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.tsx'));

let imageCounter = 1;
const downloadMap = new Map(); // URL -> Local filename

for (const file of files) {
  const filePath = path.join(dirPath, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find all https://lh3.googleusercontent.com URLs
  const urlRegex = /https:\/\/lh3\.googleusercontent\.com\/[^\s"']+/g;
  let matches = content.match(urlRegex) || [];
  
  for (const url of matches) {
    if (!downloadMap.has(url)) {
      const ext = url.includes('w=') ? 'png' : 'jpg'; // guess format, they are typically JPEGs without w=
      const localName = `image-${imageCounter++}.jpg`;
      const localPath = `/images/${localName}`;
      downloadMap.set(url, { localName, localPath, url });
    }
    
    // Replace URL in the file content
    content = content.replace(url, downloadMap.get(url).localPath);
  }
  
  // Write the replacement back
  fs.writeFileSync(filePath, content, 'utf-8');
}

// Ensure dir exists
const imgDir = 'C:/Projects/brokermike/landingpage/public/images';
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Now download the images
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }
      const writeStream = fs.createWriteStream(dest);
      res.pipe(writeStream);
      writeStream.on('finish', () => {
        writeStream.close();
        resolve(dest);
      });
    }).on('error', err => reject(err));
  });
}

async function runDownloads() {
  for (const entry of Array.from(downloadMap.values())) {
    try {
      const dest = path.join(imgDir, entry.localName);
      console.log(`Downloading ${entry.url} to ${dest}`);
      await downloadImage(entry.url, dest);
    } catch (e) {
      console.error(e);
    }
  }
  console.log('All downloads completed');
  // Write the mapping for my reference
  fs.writeFileSync('C:/Projects/brokermike/landingpage/download-map.json', JSON.stringify(Array.from(downloadMap.entries()), null, 2));
}

runDownloads();
