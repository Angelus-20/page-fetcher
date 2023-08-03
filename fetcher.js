const https = require('https');
const fs = require('fs');
const { URL } = require('url');

function downloadFile(url, filePath) {
  const urlObj = new URL(url);

  const items = {
    hostname: urlObj.hostname,
    port: urlObj.port,
    path: urlObj.pathname,
    method: 'GET',
  };

  const fileStream = fs.createWriteStream(filePath);

  const request = https.request(items, (response) => {
    let downloadedBytes = 0;

    response.on('data', (data) => {
      fileStream.write(data);
      downloadedBytes += data.length;
    });

    response.on('end', () => {
      fileStream.end();
      console.log(`Downloaded and saved ${downloadedBytes} bytes to ${filePath}.`);
    });
  });

  request.on('error', (error) => {
    console.error('Error downloading the file:', error.message);
  });

  request.end();
}

if (process.argv.length !== 4) {
  console.error('Usage: node fetcher.js <URL> <localFilePath>');
  process.exit(1);
}

const url = process.argv[2];
const localFilePath = process.argv[3];

downloadFile(url, localFilePath);
