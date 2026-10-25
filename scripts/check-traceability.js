#!/usr/bin/env node
/* Verifies every test case in docs/test-case-index.json is implemented exactly once under tests/. */
const fs = require('fs');
const path = require('path');

const index = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'test-case-index.json'), 'utf8'));
const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.spec.ts')) files.push(p);
  }
})(path.join(__dirname, '..', 'tests'));

const text = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
const missing = [];
const duplicated = [];
for (const e of index) {
  const hits = (text.match(new RegExp(`name\\('${e.tc}'`, 'g')) || []).length;
  if (hits === 0) missing.push(e.tc);
  if (hits > 1) duplicated.push(e.tc);
}
console.log(`Test cases in design sheet: ${index.length}; spec files: ${files.length}`);
if (missing.length) console.log('NOT IMPLEMENTED:', missing.join(', '));
if (duplicated.length) console.log('IMPLEMENTED MORE THAN ONCE:', duplicated.join(', '));
if (!missing.length && !duplicated.length) console.log('OK: every test case is implemented exactly once.');
process.exit(missing.length || duplicated.length ? 1 : 0);
