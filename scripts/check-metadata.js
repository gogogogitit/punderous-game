import https from 'https';
import { join } from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOMAIN = 'punderous.com';

const IMAGE_FILES = [
  {
    path: '/og-image.png',
    type: 'OpenGraph Image',
    requiredSize: { width: 1200, height: 630 }
  },
  {
    path: '/og-image.jpg',
    type: 'OpenGraph Image (JPG)',
    requiredSize: { width: 1200, height: 630 }
  },
  {
    path: '/twitter-image.png',
    type: 'Twitter Image',
    requiredSize: { width: 1200, height: 600 }
  },
  {
    path: '/twitter-image.jpg',
    type: 'Twitter Image (JPG)',
    requiredSize: { width: 1200, height: 600 }
  },
  {
    path: '/opengraph-image.jpg',
    type: 'OpenGraph Image (Next.js)',
    requiredSize: { width: 1200, height: 630 }
  },
  {
    path: '/opengraph-image.png',
    type: 'OpenGraph Image (Next.js PNG)',
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

// Utility for consistent logging
const log = {
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  info: (msg) => console.log(`ℹ️ ${msg}`),
  header: (msg) => console.log(`\n${msg}`),
  data: (msg) => console.log(`   ${msg}`)
};

async function checkLocalFiles() {
  log.header('📂 Checking local files in public directory...');
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

      log.success(`${file.path} (${size} KB)`);
      log.data(`Required size: ${file.requiredSize.width}x${file.requiredSize.height}px`);
    } catch (error) {
      results.push({
        path: file.path,
        exists: false,
        type: file.type,
        requiredSize: file.requiredSize
      });
      log.error(`${file.path} (not found locally)`);
    }
  }

  return results;
}

async function checkRemoteFile(file) {
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
        // Enhanced meta tag checking
        const checks = {
          ogImage: /<meta property="og:image" content="([^"]+)"/,
          twitterImage: /<meta name="twitter:image" content="([^"]+)"/,
          canonical: /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/,
          title: /<meta property="og:title" content="([^"]+)"/,
          description: /<meta property="og:description" content="([^"]+)"/,
          twitterCard: /<meta name="twitter:card" content="([^"]+)"/,
          twitterTitle: /<meta name="twitter:title" content="([^"]+)"/,
          twitterDescription: /<meta name="twitter:description" content="([^"]+)"/
        };

        const results = Object.entries(checks).reduce((acc, [key, regex]) => {
          const match = data.match(regex);
          acc[key] = match ? match[1] : null;
          return acc;
        }, {});

        resolve(results);
      });
    }).on('error', (error) => {
      resolve({ error: error.message });
    });
  });
}

async function generateReport(localFiles, remoteResults, metaTags) {
  const report = {
    timestamp: new Date().toISOString(),
    domain: DOMAIN,
    localFiles,
    remoteFiles: remoteResults,
    metaTags,
    recommendations: []
  };

  // Add recommendations based on checks
  if (remoteResults.some(r => r.status !== 200)) {
    report.recommendations.push('Some image files are not accessible remotely');
  }

  if (!metaTags.ogImage) {
    report.recommendations.push('Missing OpenGraph image meta tag');
  }

  if (!metaTags.twitterCard) {
    report.recommendations.push('Missing Twitter card meta tag');
  }

  if (!metaTags.canonical) {
    report.recommendations.push('Missing canonical URL');
  }

  // Save report to file
  const reportPath = join(process.cwd(), 'metadata-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  return report;
}

async function main() {
  log.header('🔍 Checking metadata and images for ' + DOMAIN);
  console.log('=======================================');

  // Check local files
  const localFiles = await checkLocalFiles();

  // Check remote files
  log.header('🌐 Checking remote files...');
  const remoteResults = await Promise.all(IMAGE_FILES.map(checkRemoteFile));
  
  remoteResults.forEach(result => {
    if (result.status === 200) {
      log.success(result.path);
      log.data(`Type: ${result.contentType}`);
      log.data(`Size: ${(result.contentLength / 1024).toFixed(2)} KB`);
    } else {
      log.error(`${result.path} (${result.status})`);
    }
  });

  // Check meta tags
  log.header('🏷️  Checking meta tags...');
  const metaTags = await checkMetaTags();
  
  if (metaTags.error) {
    log.error('Error checking meta tags: ' + metaTags.error);
  } else {
    Object.entries(metaTags).forEach(([key, value]) => {
      if (value) {
        log.success(`${key}: ${value}`);
      } else {
        log.error(`${key}: Not found`);
      }
    });
  }

  // Generate and save report
  const report = await generateReport(localFiles, remoteResults, metaTags);

  log.header('📋 Recommendations:');
  report.recommendations.forEach(rec => log.info(rec));
  
  log.header('🔗 Validation Tools:');
  console.log('- Facebook: https://developers.facebook.com/tools/debug/');
  console.log('- Twitter: https://cards-dev.twitter.com/validator');
  console.log('- LinkedIn: https://www.linkedin.com/post-inspector/');
  console.log('\nReport saved to metadata-report.json');
}

main().catch(console.error);