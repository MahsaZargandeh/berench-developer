const fs = require('fs');
const path = require('path');

const PREFIX = 'tw-';
const SRC_DIR = path.join(__dirname, 'src');
const FILE_EXTENSIONS = ['.html', '.css', '.js'];

const tailwindClassRegex = /(?<!tw-)\b([a-z0-9_-]+:[a-z0-9_-]+|[a-z0-9_-]+)\b/g;

function addPrefixToClasses(content) {
  return content.replace(tailwindClassRegex, (match) => {
    if (match.startsWith(PREFIX) || match.includes('.') || match.includes('/')) {
      return match;
    }
    return `${PREFIX}${match}`;
  });
}

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (!FILE_EXTENSIONS.includes(ext)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = addPrefixToClasses(content);

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      processFile(fullPath);
    }
  });
}

console.log('🔄 Adding prefixes...');
walkDir(SRC_DIR);
console.log('🎉 Done!');
