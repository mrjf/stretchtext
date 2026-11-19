const baseline = 0.76;
const glideTime = 180,
  popTime = 245,
  closeTime = 122;
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

function glideAt(ms, hold) {
  const t = Math.max(0, Math.min(1, (ms / glideTime - hold) / (1 - hold)));
  return smooth(t);
}

function popAt(t) {
  if (t < 0.68) return 1.05 * (1 - (1 - t / 0.68) ** 2.5);
  return 1.05 - 0.05 * smooth((t - 0.68) / 0.32);
}

function between(a, b, t) {
  return { x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t) };
}

// Align the two readings in order. Prefer a word from the same verse when
// a common word occurs several times, or two lines merge into one.
function matchWords(before, after, oldLines, newLines) {
  const stride = after.length + 1;
  const score = new Int32Array((before.length + 1) * stride);
  const step = new Uint8Array(score.length);
  for (let i = before.length - 1; i >= 0; i--) {
    for (let j = after.length - 1; j >= 0; j--) {
      const at = i * stride + j;
      const skipOld = score[at + stride],
        skipNew = score[at + 1];
      score[at] = Math.max(skipOld, skipNew);
      step[at] = skipOld >= skipNew ? 1 : 2;
      const a = before[i],
        b = after[j];
      if (a.key !== b.key) continue;
      const sameLine = a.family === b.family;
      const distance = Math.abs(((a.line + 0.5) * newLines) / oldLines - b.line - 0.5);
      if (!sameLine && distance > 1.5) continue;
      const weight =
        (sameLine ? 60 : 8) + Math.min(10, a.key.length) - Math.round(Math.min(distance, 3));
      const paired = weight + score[at + stride + 1];
      if (paired >= score[at]) {
        score[at] = paired;
        step[at] = 3;
      }
    }
  }
  const pairs = new Map();
  let i = 0,
    j = 0;
  while (i < before.length && j < after.length) {
    const move = step[i * stride + j];
    if (move === 3) pairs.set(after[j++], before[i++]);
    else if (move === 1) i++;
    else j++;
  }
  return pairs;
}

// All poses are in the poem's own coordinate system, inside the gesture stretch.
function transform(box, pose) {
  return (
    'translate(' +
    (pose.x - box.x) +
    'px,' +
    (pose.y - box.y) +
    'px) ' +
    'scale(' +
    pose.w / (box.w || 1) +
    ',' +
    pose.h / (box.h || 1) +
    ')'
  );
}

function findHinge(word, line, anchors) {
  let nearest;
  for (const candidate of line) {
    if (
      anchors.has(candidate) &&
      (!nearest || Math.abs(candidate.index - word.index) < Math.abs(nearest.index - word.index))
    )
      nearest = candidate;
  }
  if (!nearest) return null;
  return { ...anchors.get(nearest), right: nearest.index < word.index };
}

// Open or close towards the moving edge of a retained neighbour. Its edge
// follows exactly the same path as its ink, including while the type grows.
function folded(box, hinge, open, glide, entering, vertical) {
  if (vertical) return { x: box.x, y: box.y + box.h * baseline * (1 - open), w: box.w, h: box.h * open };
  if (!hinge) return { x: box.x + (box.w * (1 - open)) / 2, y: box.y, w: box.w * open, h: box.h };
  const reference = entering ? hinge.end : hinge.start;
  const current = between(hinge.start, hinge.end, glide);
  const scale = current.h / (reference.h || 1);
  const edge = (r) => (hinge.right ? r.x + r.w : r.x);
  return {
    x: edge(current) + (box.x - edge(reference)) * scale * open,
    y: current.y + (box.y - reference.y) * scale,
    w: box.w * scale * open,
    h: box.h * scale
  };
}

// A large text still gets stable, in-order word identities without a quadratic table.
function matchLongPassage(before, after) {
  const rows = new Map(),
    pairs = new Map();
  before.forEach((word, index) => {
    if (!rows.has(word.family)) rows.set(word.family, new Map());
    const row = rows.get(word.family);
    if (!row.has(word.key)) row.set(word.key, { indices: [], cursor: 0 });
    row.get(word.key).indices.push(index);
  });
  let last = -1;
  for (const word of after) {
    const group = rows.get(word.family)?.get(word.key);
    if (!group) continue;
    while (group.cursor < group.indices.length && group.indices[group.cursor] <= last) group.cursor++;
    if (group.cursor === group.indices.length) continue;
    last = group.indices[group.cursor++];
    pairs.set(word, before[last]);
  }
  return pairs;
}

// A changing word can use the gap between its two surviving neighbours.
// A neighbour on a different line owns the whole height of its line.
function gaps(words, anchors) {
  const result = new Map();
  let before;
  for (const word of words) {
    if (anchors.has(word)) {
      before = word;
      continue;
    }
    result.set(word, { before: anchors.get(before), sameBefore: before?.line === word.line });
  }
  let after;
  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i];
    if (anchors.has(word)) {
      after = word;
      continue;
    }
    const gap = result.get(word);
    gap.after = anchors.get(after);
    gap.sameAfter = after?.line === word.line;
    gap.key = (gap.before?.id ?? 'start') + '/' + (gap.after?.id ?? 'end');
  }
  return result;
}

function clipToGap(pose, gap, progress) {
  const edges = [-25, -25, -25, -25]; // Leave room for native glyph overhang.
  if (gap.before) {
    const b = between(gap.before.start, gap.before.end, progress);
    if (gap.sameBefore) edges[3] = (100 * (b.x + b.w - pose.x)) / Math.max(0.01, pose.w);
    else edges[0] = (100 * (b.y + b.h - pose.y)) / Math.max(0.01, pose.h);
  }
  if (gap.after) {
    const b = between(gap.after.start, gap.after.end, progress);
    if (gap.sameAfter) edges[1] = (100 * (pose.x + pose.w - b.x)) / Math.max(0.01, pose.w);
    else edges[2] = (100 * (pose.y + pose.h - b.y)) / Math.max(0.01, pose.h);
  }
  return (
    'inset(' + edges.map((value) => Math.max(-25, Math.min(100, value)).toFixed(2) + '%').join(' ') + ')'
  );
}

const ramp = (t) => smooth(Math.max(0, Math.min(1, t)));

export function createWordSpring(stage, block, overlay) {
  const doc = stage.ownerDocument;
  let active = [],
    rows = [],
    previousFamilies = [];
  const departing = new Set();
  const tracks = new Map();

  function cancel(node) {
    tracks.get(node)?.cancel();
    tracks.delete(node);
  }

  function play(word, phase, duration, poseAt, effect) {
    const node = word.node,
      box = word.box;
    const keyframes = [];
    const steps = Math.ceil(duration / 14);
    for (let i = 0; i <= steps; i++) {
      const pose = poseAt(i / steps);
      const frame = { transform: transform(box, pose) };
      if (pose.opacity !== undefined) frame.opacity = pose.opacity;
      if (pose.clipPath) frame.clipPath = pose.clipPath;
      keyframes.push(frame);
    }
    const timing = { duration, fill: 'both' };
    let animation;
    if (effect) {
      try {
        const custom = effect({ phase, word: word.text, keyframes, timing });
        animation = node.animate(custom?.keyframes ?? keyframes, custom?.timing ?? timing);
      } catch (error) {
        doc.defaultView.reportError?.(error);
      }
    }
    animation ??= node.animate(keyframes, timing);
    tracks.set(node, animation);
    animation.finished.then(
      () => {
        if (tracks.get(node) !== animation) return;
        tracks.delete(node);
        if (phase === 'leave' && departing.delete(word)) node.remove();
        animation.cancel();
      },
      () => {}
    );
  }

  function reset() {
    for (const animation of tracks.values()) animation.cancel();
    tracks.clear();
    departing.clear();
    overlay.replaceChildren();
  }

  function render(texts, families, breaks, size, animate, effect) {
    animate = Boolean(animate && active.length && stage.animate);
    const origin = stage.getBoundingClientRect();
    const sx = origin.width / (stage.offsetWidth || 1) || 1;
    const sy = origin.height / (stage.offsetHeight || 1) || 1;
    function bounds(node) {
      const r = node.getBoundingClientRect();
      return { x: (r.x - origin.x) / sx, y: (r.y - origin.y) / sy, w: r.width / sx, h: r.height / sy };
    }
    const positions = new Map();
    if (animate) {
      for (const word of [...active, ...departing]) {
        const pose = bounds(word.node);
        pose.opacity = Number(doc.defaultView.getComputedStyle(word.node).opacity);
        positions.set(word, pose);
      }
    } else reset();

    const nextRows = texts.map((text, line) =>
      Array.from(text.matchAll(/(\s*)(\S+)/gu), (m, index) => ({
        space: m[1],
        text: m[2],
        key: m[2].toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '') || m[2],
        family: families[line],
        line,
        lineCount: texts.length,
        index,
        size
      }))
    );
    const next = nextRows.flat();
    let pairs = new Map();
    if (animate)
      pairs =
        active.length * next.length > 1_000_000
          ? matchLongPassage(active, next)
          : matchWords(active, next, rows.length, nextRows.length);
    const oldAnchors = new Map(),
      newAnchors = new Map();
    const retained = new Set(pairs.values()),
      revived = new Map();
    const underway = new Map();
    for (const word of departing) {
      if (!underway.has(word.key)) underway.set(word.key, new Set());
      underway.get(word.key).add(word);
    }
    const fragment = doc.createDocumentFragment();
    for (const [line, words] of nextRows.entries()) {
      const row = doc.createElement('div');
      row.className = 'st-line';
      if (breaks.includes(line)) row.style.paddingTop = '0.6528em';
      for (const word of words) {
        let prior = pairs.get(word);
        if (!prior && underway.get(word.key)?.size) {
          // A quick scrub can revive a word on a different line while its old
          // instance is still closing. Catch it from its current visible pose.
          const candidates = underway.get(word.key);
          let nearest = Infinity;
          for (const old of candidates) {
            if (old.family === word.family) {
              prior = old;
              break;
            }
            const distance = Math.abs((old.line + .5) / old.lineCount - (line + .5) / texts.length);
            if (distance < nearest) {
              nearest = distance;
              prior = old;
            }
          }
          candidates.delete(prior);
          departing.delete(prior);
          revived.set(word, prior);
        }
        const node = (word.node = prior ? prior.node : doc.createElement('span'));
        if (prior) {
          cancel(node);
          node.removeAttribute('style');
        }
        node.className = 'st-word';
        node.textContent = word.text;
        if (word.space) row.append(word.space);
        row.append(node);
      }
      const trailing = texts[line].match(/\s+$/u);
      if (trailing) row.append(trailing[0]);
      fragment.append(row);
    }
    block.style.fontSize = size + 'px';
    block.replaceChildren(fragment);
    for (const word of next) word.box = bounds(word.node);
    for (const [word, prior] of pairs) {
      const start = { ...positions.get(prior) };
      if (
        prior.text !== word.text &&
        Math.abs(start.w / (prior.box.w || 1) - start.h / (prior.box.h || 1)) < 0.014
      )
        start.w = (word.box.w * start.h) / (word.box.h || 1);
      const anchor = { start, end: word.box, id: newAnchors.size };
      newAnchors.set(word, anchor);
      oldAnchors.set(prior, anchor);
    }
    if (animate) {
      const hold = next.length < active.length ? 0.22 : 0;
      const outgoing = gaps(active, oldAnchors),
        incoming = gaps(next, newAnchors);
      const closing = new Set(Array.from(outgoing.values(), (gap) => gap.key));
      const opening = new Set(Array.from(incoming.values(), (gap) => gap.key));
      for (const word of active) {
        if (retained.has(word)) continue;
        const node = word.node,
          box = word.box,
          start = positions.get(word);
        cancel(node);
        Object.assign(node.style, {
          position: 'absolute',
          left: box.x + 'px',
          top: box.y + 'px',
          fontSize: word.size + 'px'
        });
        overlay.append(node);
        departing.add(word);
        const vertical = !families.includes(word.family) && rows.length !== nextRows.length;
        const hinge = findHinge(word, rows[word.line], oldAnchors);
        const gap = outgoing.get(word);
        play(
          word,
          'leave',
          closeTime,
          (t) => {
            const progress = glideAt(t * closeTime, hold),
              open = 1 - smooth(t);
            const pose = folded(start, hinge, open, progress, false, vertical);
            // Hand a shared gap to its incoming ink before the gap closes.
            pose.opacity =
              start.opacity *
              (opening.has(gap.key) ? 1 - ramp((t - 0.25) / 0.35) : ramp((open - 0.2) / 0.35));
            pose.clipPath = clipToGap(pose, gap, progress);
            return pose;
          },
          effect
        );
      }
      for (const word of next) {
        const box = word.box;
        if (pairs.has(word)) {
          const { start } = newAnchors.get(word);
          if (
            start.opacity === 1 &&
            Math.abs(start.x - box.x) +
              Math.abs(start.y - box.y) +
              Math.abs(start.w - box.w) +
              Math.abs(start.h - box.h) <
              0.15
          )
            continue;
          play(
            word,
            'move',
            glideTime,
            (t) => {
              const p = between(start, box, glideAt(t * glideTime, hold));
              p.opacity = mix(start.opacity, 1, smooth(t));
              return p;
            },
            effect
          );
          continue;
        }
        const vertical = !previousFamilies.includes(word.family) && rows.length !== nextRows.length;
        const hinge = findHinge(word, nextRows[word.line], newAnchors);
        const caught = positions.get(revived.get(word));
        const seam = caught && folded(box, hinge, 0, 0, true, vertical);
        const gap = incoming.get(word);
        play(
          word,
          'enter',
          popTime,
          (t) => {
            const progress = glideAt(t * popTime, hold);
            let open = popAt(t);
            if (hinge && !vertical) {
              const height = mix(hinge.start.h, hinge.end.h, progress);
              open = Math.min(open, ((progress + 0.08) * hinge.end.h) / Math.max(1, height));
            }
            const pose = folded(box, hinge, open, progress, true, vertical);
            if (caught) {
              const remaining = Math.max(0, 1 - open);
              for (const axis of ['x', 'y', 'w', 'h'])
                pose[axis] += (caught[axis] - seam[axis]) * remaining;
            }
            const reveal = closing.has(gap.key)
              ? ramp((t * popTime - closeTime * 0.65) / 45)
              : ramp(open / 0.18);
            pose.opacity = mix(caught?.opacity ?? 0, 1, reveal);
            pose.clipPath = clipToGap(pose, gap, progress);
            return pose;
          },
          effect
        );
      }
    }
    active = next;
    rows = nextRows;
    previousFamilies = families;
  }
  return { render, reset };
}
