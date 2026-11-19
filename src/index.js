import { bindGestures, createTension } from './gestures.js';
import { createWordSpring } from './word-spring.js';

const lineHeight = 1.36;
const stanzaGap = 0.48;
const styleText = `
:where(stretch-text[data-st-ready]) {
  display:block; position:relative; block-size:min(64vh,36rem);
}
:where(stretch-text[data-st-ready]:focus-visible) { outline:2px solid currentColor; outline-offset:2px; }
:where(stretch-text) > .st-stage {
  position:absolute; inset:0; overflow:hidden; isolation:isolate;
  touch-action:none; overscroll-behavior:contain; text-align:start;
  font:inherit; line-height:1.36; letter-spacing:inherit;
}
:where(stretch-text) .st-block {
  position:absolute; inset:0; margin:auto; width:max-content; height:max-content;
  line-height:1.36; text-align:start;
}
:where(stretch-text) .st-line { white-space:pre; margin:0; min-height:1.36em; }
:where(stretch-text) .st-word {
  position:relative; display:inline-block; font:inherit; transform-origin:0 0;
  white-space:pre; vertical-align:baseline;
}
:where(stretch-text) .st-departures {
  position:absolute; inset:0; pointer-events:none; user-select:none;
}
`;

function installStyles(host) {
  const root = host.getRootNode();
  const target = root.head || root;
  if (target.querySelector('style[data-stretch-text]')) return;
  const style = host.ownerDocument.createElement('style');
  style.dataset.stretchText = '';
  style.textContent = styleText;
  target.append(style);
}

function originalUnits(poem) {
  return poem.originalUnits ?? poem.maxUnits;
}

function coordinate(value, max) {
  if (!Number.isFinite(value)) throw new TypeError('A form coordinate must be a finite number.');
  return Math.min(max, Math.max(1, Math.round(value)));
}

function readForm(poem, lines, units) {
  const text = poem.read(lines, units);
  if (!Array.isArray(text) || text.length !== lines || !text.every((line) => typeof line === 'string'))
    throw new TypeError('read(lines, units) must return one string per line.');
  const keys = poem.keys?.(lines) ?? text.map((_, i) => i);
  const breaks = poem.breaks?.(lines) ?? [];
  if (!Array.isArray(keys) || keys.length !== lines || new Set(keys).size !== lines)
    throw new TypeError('keys(lines) must return a unique key for each line.');
  if (!Array.isArray(breaks) || breaks.some((i) => !Number.isInteger(i) || i < 1 || i >= lines))
    throw new TypeError('breaks(lines) must contain zero-based stanza starts after the first line.');
  return { text, keys, breaks: [...new Set(breaks)] };
}

export class StretchText extends (globalThis.HTMLElement ?? class {}) {
  #poem = null;
  #full = null;
  #form = null;
  #effect = null;
  #view = null;

  get poem() {
    return this.#poem;
  }
  set poem(poem) {
    if (poem == null) {
      this.#unmount();
      this.#poem = this.#full = this.#form = null;
      return;
    }
    if (
      !Number.isSafeInteger(poem.maxLines) ||
      poem.maxLines < 1 ||
      !Number.isSafeInteger(poem.maxUnits) ||
      poem.maxUnits < 1 ||
      !Number.isSafeInteger(originalUnits(poem)) ||
      originalUnits(poem) < 1 ||
      originalUnits(poem) > poem.maxUnits ||
      typeof poem.read !== 'function'
    )
      throw new TypeError(
        'A poem needs positive integer maxLines, maxUnits and a read(lines, units) function.'
      );
    const full = readForm(poem, poem.maxLines, originalUnits(poem));
    this.#unmount();
    this.#poem = poem;
    this.#full = full;
    this.#form = { lines: poem.maxLines, units: originalUnits(poem) };
    if (this.isConnected) this.#mount();
  }
  get effect() {
    return this.#effect;
  }
  set effect(value) {
    if (value != null && typeof value !== 'function')
      throw new TypeError('effect must be a function or null.');
    this.#effect = value;
  }
  get form() {
    return this.#form && { ...this.#form };
  }

  connectedCallback() {
    // Properties may have been assigned before the browser upgraded the tag.
    for (const key of ['poem', 'effect']) {
      if (Object.hasOwn(this, key)) {
        const value = this[key];
        delete this[key];
        this[key] = value;
      }
    }
    if (this.#poem && !this.#view) this.#mount();
  }
  disconnectedCallback() {
    this.#unmount();
  }

  setForm(lines, units, { animate = true } = {}) {
    if (!this.#poem) throw new Error('Assign a poem before calling setForm().');
    this.#changeForm(lines, units, animate, false);
  }

  #changeForm(lineInput, unitInput, animate, gesture) {
    const poem = this.#poem;
    const lines = coordinate(lineInput, poem.maxLines),
      units = coordinate(unitInput, poem.maxUnits);
    if (this.#form.lines === lines && this.#form.units === units) return;
    const form = readForm(poem, lines, units);
    if (!gesture) this.#view?.gestures.reset();
    this.#form = { lines, units };
    if (!this.#view) return;
    this.#draw(form, animate);
    this.#announce();
  }

  #announce() {
    this.dataset.lines = this.#form.lines;
    this.dataset.units = this.#form.units;
    this.dispatchEvent(new CustomEvent('formchange', { bubbles: true, detail: this.form }));
  }

  #mount() {
    const doc = this.ownerDocument,
      win = doc.defaultView;
    installStyles(this);
    const saved = doc.createDocumentFragment();
    while (this.firstChild) saved.append(this.firstChild);
    const stage = doc.createElement('div'),
      block = doc.createElement('div'),
      overlay = doc.createElement('div');
    stage.className = 'st-stage';
    block.className = 'st-block';
    overlay.className = 'st-departures';
    overlay.inert = true;
    overlay.setAttribute('aria-hidden', 'true');
    stage.append(block, overlay);
    const oldTabIndex = this.getAttribute('tabindex');
    if (oldTabIndex === null) this.tabIndex = 0;
    this.dataset.stReady = '';
    this.append(stage);
    const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
    const renderer = createWordSpring(stage, block, overlay);
    const motion = createTension(stage, block, reduced);
    const gestures = bindGestures(stage, {
      read: () => ({
        x: this.#form.units,
        y: this.#form.lines,
        maxX: this.#poem.maxUnits,
        maxY: this.#poem.maxLines
      }),
      move: (dx, dy) => this.#changeForm(this.#form.lines + dy, this.#form.units + dx, true, true),
      axesAt: (x, y) => {
        const r = block.getBoundingClientRect();
        if (!r.width || !r.height) return 'xy';
        const u = Math.abs((2 * (x - r.x)) / r.width - 1),
          v = Math.abs((2 * (y - r.y)) / r.height - 1);
        if (u > 0.5 && u > v * 1.4) return 'x';
        if (v > 0.5 && v > u * 1.4) return 'y';
        return 'xy';
      },
      motion
    });
    const controller = new win.AbortController();
    const options = { signal: controller.signal };
    const ctx = doc.createElement('canvas').getContext('2d');
    const view = (this.#view = {
      stage,
      block,
      saved,
      oldTabIndex,
      reduced,
      renderer,
      gestures,
      controller,
      ctx
    });
    const refresh = () => {
      if (view !== this.#view) return;
      gestures.reset();
      this.#draw(readForm(this.#poem, this.#form.lines, this.#form.units), false);
    };
    let width = stage.clientWidth,
      height = stage.clientHeight;
    view.observer = new win.ResizeObserver(() => {
      if (width === stage.clientWidth && height === stage.clientHeight) return;
      width = stage.clientWidth;
      height = stage.clientHeight;
      refresh();
    });
    view.observer.observe(stage);
    reduced.addEventListener('change', refresh, options);
    doc.fonts?.addEventListener('loadingdone', refresh, options);
    win.addEventListener('blur', gestures.reset, options);
    doc.addEventListener('visibilitychange', gestures.reset, options);
    this.addEventListener(
      'keydown',
      (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target !== this)
          return;
        let { lines, units } = this.#form;
        switch (event.key) {
          case 'ArrowUp':
            lines--;
            break;
          case 'ArrowDown':
            lines++;
            break;
          case 'ArrowLeft':
            units--;
            break;
          case 'ArrowRight':
            units++;
            break;
          case 'Home':
            lines = units = 1;
            break;
          case 'End':
            lines = this.#poem.maxLines;
            units = originalUnits(this.#poem);
            break;
          default:
            return;
        }
        event.preventDefault();
        this.setForm(lines, units);
      },
      options
    );
    refresh();
    this.#announce();
  }

  #unmount() {
    const view = this.#view;
    if (!view) return;
    this.#view = null;
    view.controller.abort();
    view.observer.disconnect();
    view.gestures.destroy();
    view.renderer.reset();
    this.replaceChildren(view.saved);
    delete this.dataset.stReady;
    delete this.dataset.lines;
    delete this.dataset.units;
    if (view.oldTabIndex === null) this.removeAttribute('tabindex');
  }

  #draw(form, animate) {
    const { stage, ctx, renderer, reduced } = this.#view;
    const font = this.ownerDocument.defaultView.getComputedStyle(this);
    ctx.font = font.fontStyle + ' ' + font.fontWeight + ' 100px ' + font.fontFamily;
    // Measure at one em so the preferred full-size ink area stays constant
    // when a shorter form has room to grow.
    const measure = ({ text, breaks }) => {
      let total = 0,
        widest = 0;
      for (const line of text) {
        const width = ctx.measureText(line).width / 100;
        total += width;
        widest = Math.max(widest, width);
      }
      const rows = (text.length + breaks.length * stanzaGap) * lineHeight;
      const fit = Math.min(
        (stage.clientWidth * 0.94) / Math.max(0.01, widest),
        (stage.clientHeight * 0.91) / rows
      );
      return { total: Math.max(0.01, total), fit };
    };
    const source = measure(this.#full),
      target = measure(form);
    const preferred = Math.min(parseFloat(font.fontSize) || 24, source.fit);
    const size = Math.max(0.1, Math.min(target.fit, preferred * Math.sqrt(source.total / target.total)));
    renderer.render(form.text, form.keys, form.breaks, size, animate && !reduced.matches, this.#effect);
  }
}

if (globalThis.customElements && !customElements.get('stretch-text')) {
  customElements.define('stretch-text', StretchText);
}
