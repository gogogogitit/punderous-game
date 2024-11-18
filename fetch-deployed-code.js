import https from 'node:https';
import { writeFile } from 'node:fs/promises';

function fetchDeployedCode(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchDeployedCode(res.headers.location).then(resolve).catch(reject);
      }

      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    const deployedUrl = 'https://punderous.com/_next/static/chunks/';
    console.log(`Attempting to fetch Next.js chunks from ${deployedUrl}...`);
    
    const html = await fetchDeployedCode(deployedUrl);
    
    // Look for JavaScript files
    const jsFiles = html.match(/['"]([\w-]+\.js)['"]/g) || [];
    
    console.log('Found JavaScript files:', jsFiles);
    
    // Try to fetch each JavaScript file
    for (const jsFile of jsFiles) {
      const fileName = jsFile.replace(/['"]/g, '');
      const fileUrl = `${deployedUrl}${fileName}`;
      
      console.log(`Fetching ${fileUrl}...`);
      const jsContent = await fetchDeployedCode(fileUrl);
      
      if (jsContent.includes('PunderousGame')) {
        console.log(`Found PunderousGame in ${fileName}`);
        await writeFile(`deployed-${fileName}`, jsContent, 'utf8');
        console.log(`Saved to deployed-${fileName}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Note: For Next.js applications, the source code might not be directly accessible.');
    console.log('Consider using Vercel CLI to pull the production deployment:');
    console.log('1. Install Vercel CLI: npm i -g vercel');
    console.log('2. Run: vercel pull --environment=production');
  }
}

main();