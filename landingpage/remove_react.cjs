const fs = require('fs');
const path = require('path');

function removeReactImport(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeReactImport(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      content = content.replace(/import React[^;]*;\n?/g, '');
      fs.writeFileSync(fullPath, content);
    }
  }
}

removeReactImport('C:/Projects/brokermike/landingpage/src');
