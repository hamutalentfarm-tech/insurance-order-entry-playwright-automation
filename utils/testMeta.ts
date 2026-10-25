import * as fs from 'fs';
import * as path from 'path';

interface IndexEntry {
  tc: string;
  vid: string;
  module: string;
  title: string;
  risk: string[];
  sdc: string[];
  layer: string;
  type: string;
  priority: string;
  tags: string[];
}

const INDEX: Record<string, IndexEntry> = {};
for (const e of JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'docs', 'test-case-index.json'), 'utf8')) as IndexEntry[]) {
  INDEX[e.tc] = e;
}

function entry(tc: string): IndexEntry {
  const e = INDEX[tc];
  if (!e) throw new Error(`Unknown test case id ${tc}. Check docs/test-case-index.json`);
  return e;
}

/** Test title: "TC-AUTH-001 | AUTH-V01 | <text>". Fails fast on a mistyped id. */
export function name(tc: string, text: string): string {
  return `${tc} | ${entry(tc).vid} | ${text}`;
}

/**
 * Tags (@smoke, @regression, module, @SDC-xx, @P1..) and annotations (risk, validation id, seeded-defect candidate)
 * come from the test design sheet so that reports can be sliced by risk or seeded defect.
 */
export function meta(tc: string): { tag: string[]; annotation: { type: string; description: string }[] } {
  const e = entry(tc);
  const annotation = [
    { type: 'validation-id', description: e.vid },
    { type: 'risk', description: e.risk.join(', ') || '-' },
    { type: 'priority', description: e.priority },
  ];
  if (e.sdc.length) annotation.push({ type: 'seeded-defect-candidate', description: e.sdc.join(', ') });
  return { tag: [...e.tags, `@${e.priority}`], annotation };
}
