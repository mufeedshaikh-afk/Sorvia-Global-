import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Give each React route an HTML entry on static hosts without SPA rewrites.
const html = await readFile('dist/index.html', 'utf8');
const definitions = await readFile('src/collections.ts', 'utf8');
const routes = ['/shop', ...Array.from(definitions.matchAll(/path: '([^']+)'/g), match => match[1])];
for (const route of routes) {
  const destination = path.join('dist', route.slice(1));
  await mkdir(destination, { recursive: true });
  await writeFile(path.join(destination, 'index.html'), html);
  await writeFile(`${destination}.html`, html);
}
console.log(`Prepared ${routes.length} static page routes.`);
