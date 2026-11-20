import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { millay } from 'stretchtext/millay';

test('every coordinate has a complete poem and a distinct key for each line', () => {
  for (let lines = 1; lines <= millay.maxLines; lines++) {
    const keys = millay.keys(lines);
    assert.equal(keys.length, lines);
    assert.equal(new Set(keys).size, lines);
    for (let units = 1; units <= millay.maxUnits; units++) {
      const form = millay.read(lines, units);
      assert.equal(form.length, lines, `${lines} × ${units}`);
      for (const line of form) {
        assert.equal(typeof line, 'string');
        assert.ok(line.trim() && !line.includes('\n'));
      }
    }
  }
});

test('the widest reading is the exact 1923 sonnet, including in the HTML fallback', () => {
  // Transcription of XIX, lines 4.1–4.14, https://rpo.library.utoronto.ca/content/sonnets-1923#poemline-42
  const original = readFileSync(new URL('./fixtures/millay-xix.txt', import.meta.url), 'utf8').trimEnd().split('\n');
  assert.equal(millay.maxLines, 14);
  assert.equal(millay.maxUnits, 10);
  assert.equal(millay.originalUnits, millay.maxUnits);
  assert.deepEqual(millay.read(millay.maxLines, millay.maxUnits), original);
  const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const fallback = page.match(/<div class="original">([\s\S]*?)<\/div>/)[1];
  assert.deepEqual([...fallback.matchAll(/<span>(.*?)<\/span>/g)].map(match => match[1]), original);
  assert.deepEqual(millay.read(1, 1), ['Once.']);
});

test('old expanded coordinates return the ten-syllable form at every height', () => {
  for (let lines = 1; lines <= millay.maxLines; lines++) {
    for (let width = 11; width <= 14; width++) {
      assert.deepEqual(millay.read(lines, width), millay.read(lines, 10));
    }
  }
});

test('the five-line contraction keeps the closing couplet and its line identities', () => {
  const before = millay.read(6, 1),
    after = millay.read(5, 1);
  assert.deepEqual(after, ['I.', 'Sigh.', 'Cry.', 'More.', 'O’er.']);
  for (const word of ['More.', 'O’er.']) {
    assert.equal(millay.keys(6)[before.indexOf(word)], millay.keys(5)[after.indexOf(word)]);
  }
});
