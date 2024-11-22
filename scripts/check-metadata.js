// scripts/check-metadata.js
import https from 'https';
import { join } from 'path';
import { promises as fs } from 'fs';
import chalk from 'chalk';

const DOMAIN = 'punderous.com';

const IMAGE_FILES = [
  {
    path: '/og-image.jpg',
    type: 'OpenGraph Image',
    requiredSize: { width: 1200, height: 630 }
  },
  {
    path: '/twitter-image.jpg',
    type: 'Twitter Image',
    requiredSize: { width: 1200, height: 600 }
  },
  {
    path: '/og-image.jpg',
    type: 'OpenGraph Image (Next.js)',
    requiredSize: { width: 1200, height: 630 }
  },
  {
    path: '/favicon.ico',
    type: 'Favicon',
    requiredSize: { width: 32, height: 32 }
  },
  {
    path: '/favicon-16x16.png',
    type: 'Small Favicon',
    requiredSize: { width: 16, height: 16 }
  },
  {
    path: '/favicon-32x32.png',
    type: 'Large Favicon',
    requiredSize: { width: 32, height: 32 }
  },
  {
    path: '/apple-touch-icon.png',
    type: 'Apple Touch Icon',
    requiredSize: { width: 180, height: 180 }
  }
];

async function checkLocalFiles() {
  console.log(chalk.blue('\n📂 Checking local files in public directory...'));
  const results = [];

  for (const file of IMAGE_FILES) {
    try {
      const filePath = join(process.cwd(), 'public', file.path.slice(1));
      const stats = await fs.stat(filePath);
      const size = (stats.size / 1024).toFixed(2);
      
      results.push({
        path: file.path,
        exists: true,
        size: `${size} KB`,
        type: file.type,
        requiredSize: file.requiredSize
      });

      console.log(chalk.green(`✅ ${file.path} (${size} KB)`));
      console.log(chalk.gray(`   Required size: ${file.requiredSize.width}x${file.requiredSize.height}px`));
    } catch (error) {
      results.push({
        path: file.path,
        exists: false,
        type: file.type,
        requiredSize: file.requiredSize
      });
      console.log(chalk.red(`❌ ${file.path} (not found locally)`));
    }
  }

  return results;
}

function checkRemoteFile(file) {
  return new Promise((resolve) => {
    const options = {
      hostname: DOMAIN,
      path: file.path,
      method: 'HEAD',
      headers: {
        'User-Agent': 'MetadataChecker/1.0'
      }
    };

    const req = https.request(options, (res) => {
      resolve({
        ...file,
        status: res.statusCode,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
      });
    });

    req.on('error', (error) => {
      resolve({
        ...file,
        status: 'error',
        error: error.message
      });
    });

    req.end();
  });
}

async function checkMetaTags() {
  return new Promise((resolve) => {
    https.get(`https://${DOMAIN}`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const ogImage = data.match(/<meta property="og:image" content="([^"]+)"/);
        const twitterImage = data.match(/<meta name="twitter:image" content="([^"]+)"/);
        const canonical = data.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
        const title = data.match(/<meta property="og:title" content="([^"]+)"/);
        const description = data.match(/<meta property="og:description" content="([^"]+)"/);
        const twitterCard = data.match(/<meta name="twitter:card" content="([^"]+)"/);
        const twitterTitle = data.match(/<meta name="twitter:title" content="([^"]+)"/);
        const twitterDescription = data.match(/<meta name="twitter:description" content="([^"]+)"/);
        
        resolve({
          ogImage: ogImage ? ogImage[1] : null,
          twitterImage: twitterImage ? twitterImage[1] : null,
          canonical: canonical ? canonical[1] : null,
          title: title ? title[1] : null,
          description: description ? description[1] : null,
          twitterCard: twitterCard ? twitterCard[1] : null,
          twitterTitle: twitterTitle ? twitterTitle[1] : null,
          twitterDescription: twitterDescription ? twitterDescription[1] : null
        });
      });
    }).on('error', (error) => {
      resolve({
        ogImage: null,
        twitterImage: null,
        canonical: null,
        title: null,
        description: null,
        twitterCard: null,
        twitterTitle: null,
        twitterDescription: null,
        error: error.message
      });
    });
  });
}

async function main() {
  console.log(chalk.blue('🔍 Checking metadata and images for ' + DOMAIN));
  console.log(chalk.gray('======================================='));

  // Check local files
  const localFiles = await checkLocalFiles();

  // Check remote files
  console.log(chalk.blue('\n🌐 Checking remote files...'));
  const remoteResults = await Promise.all(IMAGE_FILES.map(checkRemoteFile));
  
  remoteResults.forEach(result => {
    if (result.status === 200) {
      console.log(chalk.green(`✅ ${result.path}`));
      console.log(chalk.gray(`   Type: ${result.contentType}`));
      console.log(chalk.gray(`   Size: ${(result.contentLength / 1024).toFixed(2)} KB`));
    } else {
      console.log(chalk.red(`❌ ${result.path} (${result.status})`));
    }
  });

  // Check meta tags
  console.log(chalk.blue('\n🏷️  Checking meta tags...'));
  const metaTags = await checkMetaTags();
  
  if (metaTags.error) {
    console.log(chalk.red(`❌ Error checking meta tags: ${metaTags.error}`));
  } else {
    Object.entries(metaTags).forEach(([key, value]) => {
      if (value) {
        console.log(chalk.green(`✅ ${key}: ${value}`));
      } else {
        console.log(chalk.red(`❌ ${key}: Not found`));
      }
    });
  }

  // Save results
  const report = {
    timestamp: new Date().toISOString(),
    domain: DOMAIN,
    localFiles,
    remoteFiles: remoteResults,
    metaTags
  };

  await fs.writeFile(
    join(process.cwd(), 'metadata-report.json'), 
    JSON.stringify(report, null, 2)
  );

  console.log(chalk.blue('\n📋 Recommendations:'));
  console.log('1. Ensure all image files exist and are accessible');
  console.log('2. OpenGraph image should be 1200x630 pixels');
  console.log('3. Twitter image should be 1200x600 pixels');
  console.log('4. Verify canonical URL is correctly set');

  console.log(chalk.blue('\n🔍 Validation Tools:'));
  console.log('- Facebook: https://developers.facebook.com/tools/debug/');
  console.log('- Twitter: https://cards-dev.twitter.com/validator');
  console.log('- LinkedIn: https://www.linkedin.com/post-inspector/');
  
  console.log('\nReport saved to metadata-report.json');
}

main().catch(console.error);