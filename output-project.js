import { promises as fs } from 'fs';
import path from 'path';

async function outputProject(dir, indent = '') {
  let output = '';
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        output += `${indent}${entry.name}/\n`;
        output += await outputProject(fullPath, indent + '  ');
      } else {
        output += `${indent}${entry.name}\n`;
        if (entry.name.endsWith('.js') || entry.name.endsWith('.ts') || entry.name.endsWith('.json')) {
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            output += `${indent}  Content:\n${indent}  ${content.replace(/\n/g, `\n${indent}  `)}\n`;
            output += `${indent}  End of ${entry.name}\n\n`;
          } catch (error) {
            output += `${indent}  Error reading file: ${error.message}\n`;
          }
        }
      }
    }
  } catch (error) {
    output += `Error processing directory ${dir}: ${error.message}\n`;
  }
  return output;
}

async function main() {
  const projectStructure = await outputProject(process.cwd());
  await fs.writeFile('project-output.txt', projectStructure, 'utf8');
  console.log('Project structure and contents have been written to project-output.txt');
}

main().catch(error => console.error('Error:', error));