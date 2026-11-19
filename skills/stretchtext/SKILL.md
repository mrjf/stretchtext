---
name: stretchtext
description: Author expandable prose or verse for Stretchtext, check its word or syllable counts across two dimensions, and embed it with Original Word Spring.
---

# Author stretchtext

Write a complete reading for each pair of dimensions. The vertical coordinate is a line count. The horizontal coordinate is a word count per line for prose or a syllable count per line for verse. A single sentence can use one line and a ladder of word counts.

## Compose the forms

1. **Establish the source.** Keep a verbatim copy with its line endings, punctuation, stanza breaks, author, title, and edition. Give the source its own coordinate, usually the tallest and widest. Credit the source and identify the other readings as adaptations. If an original line has irregular meter or length, preserve it and record that exception when checking counts.
2. **Find what survives.** Name the central image or claim, the speaker’s attitude, and the turn that gives the ending its force. For factual prose, also identify who did what, the quantities, and any qualification that changes the claim. Draft the single word, the one-line reading, and the full-height reading at one unit wide. Choose the one word by reading it back against the ending. The adaptation of Millay lands on “Once.” It holds both the remembered singing and its absence now.
3. **Compose each height.** Assign persistent keys to lines by their role, such as `rain`, `tree`, and `summer`. Decide which images can share a line when reducing the height. Write the merged line as a sentence or phrase in its own right. Preserve reading order and the turn. In a sonnet, a shorter octave and sestet can still answer each other. In a couplet, the second line can carry that answer.
4. **Write a ladder for each keyed line.** Start with its shortest and fullest readings. Fill every intermediate width, keeping recognizable words in the same order where possible. In prose, use a consistent counting convention for contractions, hyphens, numbers, and names. For a deletion-only request, remove one word at each step and preserve the order of the survivors. For a free adaptation, rewrite the phrase when a literal deletion loses its meaning. A predictable word is a candidate for removal, but a predictable “no” or “only” can carry the entire claim. Log probabilities score tokens in context. Judge a candidate by reading the resulting sentence.
5. **Write verse aloud.** Mark the rhyme words and stressed beats before filling the ladder. Keep the ending, or choose a new pair together. Preserve the original’s exact or slant rhyme as appropriate. At odd syllable counts, a shortened foot or pickup can sound more natural than padding a line. At one syllable, choose a stressed word with an image or an answering rhyme. Check elisions, names and regional pronunciations by ear. Syllable dictionaries can suggest counts for ambiguous words.
6. **Read in both directions.** Read every form straight through as a piece of writing. Then compare every horizontal and vertical neighbor, forward and backward. Watch for dangling references, premature revelations, a change of speaker, or repeated text introduced by a merge. Repair the relevant ladder or write a cell-specific reading. Keep the verbatim source as an explicit override.

For a deletion-only prose ladder, “Our porch light burns.” → “Porch light burns.” → “Light burns.” → “Light.” has four, three, two, and one word. Verify each adjacent pair by removing one token from the longer form. Permit changes to case and terminal punctuation when the brief allows them. For factual material, prefer a shorter phrase that still makes a true claim. A single word can carry the subject once the numbers and their relationship can no longer fit.

## Represent the text

Use one ordered list of keys per height and one array of widths per key. This lets a phrase recur across many forms while keeping every reading authored. The following original example covers all eight cells of a two-line, four-syllable piece.

```js
// bird.js
const layouts = [
  ['flight'],
  ['swifts', 'sky']
];
const lines = {
  flight: ['Flight.', 'Birds fly.', 'Two birds fly.', 'Birds cross the sky.'],
  swifts: ['Fly.', 'Swifts fly.', 'Swifts fly high.', 'The swifts fly high.'],
  sky: ['Sky.', 'Blue sky.', 'Through the sky.', 'Across the sky.']
};

export const bird = {
  maxLines: 2,
  maxUnits: 4,
  originalUnits: 4,
  keys(height) { return layouts[height - 1]; },
  read(height, width) {
    return layouts[height - 1].map(key => lines[key][width - 1]);
  }
};
```

Coordinates begin at one. `read(height, width)` returns exactly `height` strings. `keys(height)` returns the same number of distinct keys in display order. Reuse a key when a line moves to another row. Optional `breaks(height)` returns sorted, zero-based indexes of lines that begin a new stanza after the first. `originalUnits` is the starting width at full height and defaults to `maxUnits`.

## Check the grid

Enumerate all `maxLines × maxUnits` cells. Assert each line is nonempty, has the intended count, and has a unique key within its form if keys are supplied. Check stanza indexes and compare the original coordinate with the source line for line. For prose, tokenize using the agreed word rule. For verse, keep a pronunciation table for the vocabulary of the piece, flag unknown words, and read each rhyme pair and stress pattern aloud. Record the pronunciation used for any disputed count. Counts alone cannot tell whether a line scans.

For the example, this independent count catches a missing cell or an extra syllable. Use the agreed pronunciations of the new work when adapting it.

```js
// check.mjs — run with Node in the module project containing bird.js
import assert from 'node:assert/strict';
import { bird } from './bird.js';

const beats = new Map(Object.entries({
  flight: 1, birds: 1, fly: 1, two: 1, cross: 1, the: 1, sky: 1,
  swifts: 1, high: 1, blue: 1, through: 1, across: 2
}));
for (let h = 1; h <= bird.maxLines; h++) {
  assert.equal(bird.keys(h).length, h);
  assert.equal(new Set(bird.keys(h)).size, h);
  for (let w = 1; w <= bird.maxUnits; w++) {
    const form = bird.read(h, w);
    assert.equal(form.length, h);
    for (const line of form) {
      const words = line.toLowerCase().match(/[a-z]+/g) || [];
      const syllables = words.reduce((sum, word) => sum + beats.get(word), 0);
      assert.equal(syllables, w, `${h} × ${w}: ${line}`);
    }
  }
}
assert.deepEqual(bird.read(2, 4), ['The swifts fly high.', 'Across the sky.']);
```

## Put it on a page

In an npm project, install `stretchtext`. Use the following in an HTML entry served by a tool that resolves npm imports. In a checkout served directly by an HTTP server, replace `import 'stretchtext'` with `import './src/index.js'` on the root page. The element accepts ordinary HTML as its fallback, so include the original text there.

```html
<stretch-text id="reading" aria-label="Flight">
  <div>The swifts fly high.</div>
  <div>Across the sky.</div>
</stretch-text>
<script type="module">
  import 'stretchtext';
  import { bird } from './bird.js';

  const reading = document.querySelector('#reading');
  reading.poem = bird;
</script>
```

The reader starts at the original. To drive it from other code, call `reading.setForm(1, 1)` or `reading.setForm(2, 4, { animate: false })`. Keep the public reading surface simple. The element handles scrolling, pinching, keyboard input, and reduced motion.

To embed Millay’s sonnet, use `import { millay } from 'stretchtext/millay'` and assign `reading.poem = millay`. Credit Edna St. Vincent Millay and identify the compressed forms as adaptations. For a plain HTML page using the hosted release, its native module URLs are `https://stretchtext.dev/src/index.js` and `https://stretchtext.dev/site/millay.js`.

## Customize the motion in code

Original Word Spring is the default. To author a variation, assign a function to the element’s `effect` property. It receives `{ phase, word, keyframes, timing }` for each entering, leaving, or moving word. Return modified Web Animations keyframes and timing for the desired phase. Returning `undefined` uses the original track. This example changes the pace of a departure.

```js
const reading = document.querySelector('#reading');
reading.effect = ({ phase, keyframes, timing }) => {
  if (phase === 'leave') {
    return { keyframes, timing: { ...timing, duration: Number(timing.duration) * 0.8 } };
  }
};
```

Set `reading.effect = null` to restore the default. Keep one visible copy of each retained word. Let outgoing ink clear a space before a replacement appears there. A fold can fade out while the letters still have height, leaving the gap to finish closing. Land incoming and retained words at their final native geometry. The element owns animation cancellation and cleanup. Scrub or reverse during a move, try fast diagonal input, and check both the last moving frame and the settled frame for duplicates or a late resize.
