'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { readMilestones } = require('./app.js');

const fixture = { milestones: Array.from({ length: 8 }, (_, i) => ({ name: `Milestone ${i + 1}`, gates: { a: true, b: false, c: false, d: false, e: false } })) };
assert.equal(readMilestones(fixture).complete, 8);
assert.equal(readMilestones(fixture).total, 40);
assert.equal(readMilestones(fixture).complete / readMilestones(fixture).total * 100, 20);
fixture.milestones[0].gates.b = true;
assert.equal(readMilestones(fixture).complete, 9);
assert.throws(() => readMilestones({ milestones: [] }));
assert.throws(() => readMilestones({ milestones: [{ name: 'Bad', gates: { pending: 'false' } }] }));
fixture.milestones[0].gates.a = 'true';
assert.throws(() => readMilestones(fixture));

const progressPath = path.join(__dirname, 'progress.json');
if (fs.existsSync(progressPath)) {
  const progress = readMilestones(JSON.parse(fs.readFileSync(progressPath, 'utf8')));
  console.log(`Published roadmap: ${progress.complete}/${progress.total} gates (${progress.complete / progress.total * 100}%).`);
}
const sandbox = { module: { exports: {} } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8'), sandbox);
let copied;
const snippet = { textContent: 'make\nmake run' };
const status = {};
sandbox.document = { getElementById: (id) => id === 'commands' ? snippet : status };
sandbox.navigator = { clipboard: { writeText: async (text) => { copied = text; } } };
sandbox.window = { isSecureContext: true, setTimeout: () => {} };
const button = { dataset: { copy: 'commands' }, textContent: 'Copy commands' };
sandbox.copyCode(button).then(() => {
  assert.equal(copied, snippet.textContent);
  assert.equal(button.textContent, 'Copied ✓');
  assert.equal(status.textContent, 'Commands copied to clipboard.');
  console.log('Roadmap parsing, count updates, malformed input, and exact clipboard text checks passed.');
}).catch((error) => { console.error(error); process.exitCode = 1; });
