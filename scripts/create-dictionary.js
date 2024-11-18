import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const words = fs.readFileSync(path.join(__dirname, '..', 'words.txt'), 'utf-8').split('\n');
const dictionary = {};

words.forEach(word => {
  const key = word.toLowerCase().split('').sort().join('');
  if (dictionary[key]) {
    dictionary[key].push(word);
  } else {
    dictionary[key] = [word];
  }
});

fs.writeFileSync(path.join(__dirname, '..', 'dictionary.json'), JSON.stringify(dictionary));
console.log('Dictionary created successfully!');