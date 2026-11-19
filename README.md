# Stretchtext

[Read the poem](https://stretchtext.dev/) · [Agent instructions for writing and embedding variations](skills/stretchtext/SKILL.md)

## Put the poem on a page

```html
<stretch-text style="display:block; height:70svh; font:3rem Georgia,serif"></stretch-text>
<script type="module">
  import 'https://stretchtext.dev/src/index.js';
  import { millay } from 'https://stretchtext.dev/site/millay.js';
  document.querySelector('stretch-text').poem = millay;
</script>
```

Install the release archive with `npm install ./stretchtext-0.1.0.tgz`. In a bundled project, use `import 'stretchtext'` and `import { millay } from 'stretchtext/millay'`. Supply your own authored forms through the same `poem` property. Original Word Spring is the built-in effect.

Scroll horizontally for words or syllables and vertically for lines. Pinch near the center for both axes. With the poem focused, use the arrow keys, Home for the shortest form, or End for the original.

Run `npm run preview` to read the demo locally with Node.js and Python 3. Run `npm pack` to build the installable package.

## Credits

The full poem is Edna St. Vincent Millay’s “What lips my lips have kissed, and where, and why,” from *The Harp-Weaver and Other Poems* (1923). The other forms are adaptations. [Source text](https://rpo.library.utoronto.ca/content/sonnets-1923)

Inspired by Ted Nelson’s *Stretchtext*. [Nelson’s description in *Computer Lib / Dream Machines*, p. 315](https://www.newmediareader.com/book_samples/nmr-21-nelson.pdf#page=15)
