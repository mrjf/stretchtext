import '../src/index.js';
import { millay } from './millay.js';

const poem = document.getElementById('poem');
const qualifier = document.getElementById('after');

poem.addEventListener('formchange', ({ detail: { lines, units } }) => {
  qualifier.hidden = lines === millay.maxLines && units === millay.originalUnits;
});

poem.poem = millay;
