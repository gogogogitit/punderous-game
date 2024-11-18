import { writeFile } from 'fs/promises';

console.log('ES modules are working');

writeFile('test.txt', 'This is a test', 'utf8')
  .then(() => console.log('File written successfully'))
  .catch(err => console.error('Error writing file:', err));