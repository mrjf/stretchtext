import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const out = new URL('dist/', root);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const path of ['index.html', 'site', 'src', 'skills/stretchtext', '_headers']) {
  await cp(new URL(path, root), new URL(path, out), { recursive: true });
}
console.log(fileURLToPath(out));
