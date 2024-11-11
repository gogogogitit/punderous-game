import fs from 'fs/promises';
import zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);

const top500Words = [
  'I', 'a', 'of', 'to', 'in', 'it', 'is', 'be', 'as', 'at', 'so', 'we', 'he', 'by', 'or', 'on', 'do', 'if', 'me', 'my', 'up', 'an', 'go', 'no', 'us', 'am',
  'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but', 'his', 'from', 'they', 'say', 'her', 'she', 'will', 'one', 'all', 'would', 'there', 'their', 'what', 'out', 'about', 'who', 'get', 'which', 'when', 'make', 'can', 'like', 'time', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  "can't",
  "don't",
  "won't",
  "isn't",
  "aren't"
  // ... (add the rest of the words here)
];

const content = top500Words.join('\n');

try {
  const compressed = await gzip(content);
  await fs.writeFile('public/dictionary.gz', compressed);
  console.log('Compressed dictionary with top 500 words created successfully.');
} catch (error) {
  console.error('Error creating compressed dictionary:', error);
  process.exit(1);
}