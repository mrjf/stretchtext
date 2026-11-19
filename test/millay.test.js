import assert from 'node:assert/strict';
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

test('the original and the one-word reading occupy their intended coordinates', () => {
  assert.equal(millay.originalUnits, 10);
  const text = millay.read(14, millay.originalUnits);
  assert.equal(text[0], 'What lips my lips have kissed, and where, and why,');
  assert.equal(text.at(-1), 'A little while, that in me sings no more.');
  assert.deepEqual(millay.read(1, 1), ['Once.']);
});

test('the five-line contraction keeps the closing couplet and its line identities', () => {
  const before = millay.read(6, 1),
    after = millay.read(5, 1);
  assert.deepEqual(after, ['I.', 'Sigh.', 'Cry.', 'More.', 'O’er.']);
  for (const word of ['More.', 'O’er.']) {
    assert.equal(millay.keys(6)[before.indexOf(word)], millay.keys(5)[after.indexOf(word)]);
  }
});
