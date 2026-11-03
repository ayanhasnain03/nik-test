import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'modules', 'nik-watch-hr', 'watch-app');
const dest = path.join(root, 'ios', 'NIKWatchApp');

if (!fs.existsSync(src)) {
  console.error('Missing watch-app sources at', src);
  process.exit(1);
}

fs.mkdirSync(dest, { recursive: true });
for (const file of fs.readdirSync(src)) {
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
  console.log('copied', file);
}
console.log('Watch sources ready at', dest);
console.log('In Xcode: add a Watch App target and include these Swift files + HealthKit.');
