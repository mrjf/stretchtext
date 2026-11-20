import '../src/index.js';
import { millay } from './millay.js';

const poem = document.getElementById('poem');
const qualifier = document.getElementById('after');
const hint = document.getElementById('hint');
const showHint = setTimeout(() => hint.classList.add('shown'), 1200);

poem.addEventListener('formchange', ({ detail: { lines, units } }) => {
  const original = lines === millay.maxLines && units === millay.originalUnits;
  qualifier.hidden = original;
  if (!original) {
    // The reader has found the gesture; retire the hint for good.
    clearTimeout(showHint);
    hint.classList.remove('shown');
  }
});

poem.poem = millay;

const copyButton = document.getElementById('copy-skill');
const copyStatus = document.getElementById('copy-status');
let skillText;
let resetCopy = 0;
function loadSkill() {
  skillText ??= fetch(copyButton.previousElementSibling.href).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  });
  skillText.catch(() => (skillText = undefined));
  return skillText;
}
copyButton.addEventListener('pointerenter', loadSkill, { once: true });
copyButton.addEventListener('focus', loadSkill, { once: true });
copyButton.addEventListener('click', async () => {
  const text = loadSkill();
  try {
    // Safari only allows a clipboard write that starts synchronously in the
    // click, so hand it the pending text rather than awaiting the fetch first.
    if (window.ClipboardItem) {
      const blob = text.then((t) => new Blob([t], { type: 'text/plain' }));
      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })]);
    } else {
      await navigator.clipboard.writeText(await text);
    }
    copyButton.classList.add('copied');
    copyStatus.textContent = 'Agent instructions copied';
  } catch {
    copyStatus.textContent = 'Could not copy. Open the link to read the instructions.';
  }
  clearTimeout(resetCopy);
  resetCopy = setTimeout(() => {
    copyButton.classList.remove('copied');
    copyStatus.textContent = '';
  }, 1600);
});
