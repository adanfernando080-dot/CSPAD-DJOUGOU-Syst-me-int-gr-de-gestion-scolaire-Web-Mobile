#!/usr/bin/env node
// Vérifie l'intégrité des documents sources (docs/sources/MANIFEST.json).
// Échec si : empreinte différente, fichier déclaré absent, ou fichier non déclaré.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCES_DIR = fileURLToPath(new URL('../docs/sources/', import.meta.url));
const IGNORED = new Set(['README.md', 'MANIFEST.json', '.gitkeep']);

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listFiles(path);
    return IGNORED.has(name) ? [] : [relative(SOURCES_DIR, path).split(sep).join('/')];
  });
}

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

const manifest = JSON.parse(readFileSync(join(SOURCES_DIR, 'MANIFEST.json'), 'utf8'));
const errors = [];
const missing = [];
const declared = new Set();

for (const doc of manifest.documents) {
  if (doc.status === 'ABSENT') {
    missing.push(`${doc.id} — ${doc.title}`);
    continue;
  }
  if (doc.status !== 'PRESENT' || !doc.file || !/^[0-9a-f]{64}$/.test(doc.sha256 ?? '')) {
    errors.push(`${doc.id} : entrée PRESENT incomplète (status, file, sha256 requis)`);
    continue;
  }
  declared.add(doc.file);
  let actual;
  try {
    actual = sha256(join(SOURCES_DIR, doc.file));
  } catch {
    errors.push(`${doc.id} : fichier déclaré introuvable (${doc.file})`);
    continue;
  }
  if (actual !== doc.sha256) {
    errors.push(`${doc.id} : empreinte différente — le document a été modifié (${doc.file})`);
  }
}

for (const file of listFiles(SOURCES_DIR)) {
  if (!declared.has(file)) errors.push(`Fichier non déclaré dans MANIFEST.json : ${file}`);
}

if (missing.length > 0) {
  console.log(`Documents sources ABSENTS (${missing.length}) :\n - ${missing.join('\n - ')}`);
}
if (errors.length > 0) {
  console.error(`\nÉCHEC de la vérification des sources :\n - ${errors.join('\n - ')}`);
  process.exit(1);
}
console.log(`\nIntégrité des sources : OK (${declared.size} document(s) présent(s) vérifié(s)).`);
