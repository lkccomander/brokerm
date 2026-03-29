const fs = require('fs');

function convertHtmlToJsx(htmlFile) {
  let content = fs.readFileSync(htmlFile, 'utf-8');
  
  // Extract body contents
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    console.error('No body found in ' + htmlFile);
    return;
  }
  
  let jsx = bodyMatch[1];
  
  // Replace class= with className=
  jsx = jsx.replace(/\bclass="/g, 'className="');
  
  // Close common unclosed tags: img, input, hr, br
  jsx = jsx.replace(/<(img[^>]*?[^\/])>/g, '<$1 />');
  jsx = jsx.replace(/<(input[^>]*?[^\/])>/g, '<$1 />');
  jsx = jsx.replace(/<(hr[^>]*?[^\/])>/g, '<$1 />');
  jsx = jsx.replace(/<(br[^>]*?[^\/])>/g, '<$1 />');

  // Replace HTML comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

  // Handle some specific HTML properties
  jsx = jsx.replace(/\bfor="/g, 'htmlFor="');
  jsx = jsx.replace(/\btabindex="/g, 'tabIndex="');
  
  // Handle some SVG attributes or missing camelCasings if any, though mostly standard HTML.
  // There are style attributes that must be inline objects or removed. For this, since it's tailwind, it's safer to just rip them out unless they are important
  jsx = jsx.replace(/\bstyle="[^"]*"/g, '');
  
  // Handle the style tags in SVG or head? None in body.
  
  // Make it a valid React component
  const componentName = global.componentName || 'Component';
  const outFile = global.outFile || 'Component.tsx';
  
  const reactCode = `export default function ${componentName}() {
  return (
    <>
      ${jsx}
    </>
  );
}
`;
  
  fs.writeFileSync(outFile, reactCode);
  console.log('Converted ' + htmlFile + ' to ' + outFile);
}

Object.assign(global, { componentName: 'Landing', outFile: 'C:/Projects/brokermike/landingpage/src/pages/Landing.tsx' });
convertHtmlToJsx('C:/Projects/brokermike/landingpage_19cf.html');

Object.assign(global, { componentName: 'Catalog', outFile: 'C:/Projects/brokermike/landingpage/src/pages/Catalog.tsx' });
convertHtmlToJsx('C:/Projects/brokermike/landingpage_1f61.html');

Object.assign(global, { componentName: 'SiteMap', outFile: 'C:/Projects/brokermike/landingpage/src/pages/SiteMap.tsx' });
convertHtmlToJsx('C:/Projects/brokermike/landingpage_9816.html');
