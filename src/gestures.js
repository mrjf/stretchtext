// Both pinch event formats feed the same logarithmic distance, so spreading
// and closing the fingers by reciprocal amounts exactly undo one another.
const pinchPixels = 300;
const wheelIdle = 240;
const threshold = 114.2; // Original Word Spring's scroll distance in CSS pixels.

function consume(distance, position, maximum, threshold) {
  const steps = Math.max(1 - position, Math.min(maximum - position, Math.trunc(distance / threshold)));
  const remainder = distance - steps * threshold;
  const atEdge =
    (position + steps === 1 && remainder < 0) || (position + steps === maximum && remainder > 0);
  return { steps, remainder: atEdge ? 0 : remainder };
}

export function bindGestures(surface, { read, move, axesAt, motion }) {
  let stream = '';
  const axisState = () => ({ carry: 0, origin: 0, committedDirection: 0 });
  let horizontal = axisState(),
    vertical = axisState();
  let axes = 'xy';
  let lastScale = 1;
  let finger;
  let idle = 0;
  const listeners = new surface.ownerDocument.defaultView.AbortController();

  function clear() {
    clearTimeout(idle);
    stream = '';
    finger = null;
    horizontal = axisState();
    vertical = axisState();
  }
  function reset() {
    clear();
    motion.reset();
  }
  function finish() {
    clear();
    motion.release();
  }
  function start(kind) {
    if (stream) finish();
    stream = kind;
  }
  function applyDelta(dx, dy) {
    const state = read();
    if (!state || !Number.isFinite(dx) || !Number.isFinite(dy)) return;
    function advance(axis, delta, position, maximum) {
      if (delta * axis.committedDirection < 0) {
        // Start visible tension from this reversal without losing the
        // distance already travelled toward either threshold.
        axis.origin = axis.carry;
        axis.committedDirection = 0;
      }
      const { steps, remainder } = consume(axis.carry + delta, position, maximum, threshold);
      axis.carry = remainder;
      return steps;
    }
    const x = advance(horizontal, dx, state.x, state.maxX);
    const y = advance(vertical, dy, state.y, state.maxY);
    if (x || y) {
      horizontal.committedDirection = Math.sign(dx || horizontal.carry) || horizontal.committedDirection;
      vertical.committedDirection = Math.sign(dy || vertical.carry) || vertical.committedDirection;
      move(x, y);
      motion.commit();
      return;
    }
    function pressure(axis) {
      if (axis.committedDirection) return 0;
      const distance = axis.carry - axis.origin;
      const direction = Math.sign(distance);
      const room = threshold - direction * axis.origin;
      return direction * Math.min(1, Math.abs(distance) / room) ** 0.865;
    }
    motion.set(pressure(horizontal), pressure(vertical));
  }
  function zoom(distance) {
    applyDelta(axes.includes('x') ? distance : 0, axes.includes('y') ? distance : 0);
  }
  function pinch(scale) {
    if (!(scale > 0) || !Number.isFinite(scale)) return;
    if (lastScale > 0) zoom(Math.log(scale / lastScale) * pinchPixels);
    lastScale = scale;
  }
  function add(type, fn) {
    surface.addEventListener(type, fn, { passive: false, signal: listeners.signal });
  }

  add('wheel', (event) => {
    if (!read()) return;
    event.preventDefault();
    if (stream === 'touch' || stream === 'pan' || stream === 'native') return;
    const kind = event.ctrlKey ? 'wheel-pinch' : 'wheel';
    if (stream !== kind) {
      start(kind);
      if (event.ctrlKey) axes = axesAt(event.clientX, event.clientY);
    }
    clearTimeout(idle);
    const units = event.deltaMode;
    const verticalUnit = units === 1 ? 16 : units === 2 ? surface.clientHeight : 1;
    const horizontalUnit = units === 2 ? surface.clientWidth : verticalUnit;
    if (event.ctrlKey) {
      // Chromium maps trackpad pinch scale to exp(-wheelDelta / 100).
      zoom((-event.deltaY * verticalUnit * pinchPixels) / 100);
    } else if (event.shiftKey && !event.deltaX) {
      applyDelta(event.deltaY * horizontalUnit, 0);
    } else {
      applyDelta(event.deltaX * horizontalUnit, event.deltaY * verticalUnit);
    }
    idle = setTimeout(finish, wheelIdle);
  });

  // Touch events own the interaction on iOS, which also emits Safari
  // GestureEvents for the same two fingers. macOS trackpads use those
  // GestureEvents directly, without an accompanying TouchEvent stream.
  function touchStart(touches) {
    if (touches.length === 1) {
      start('pan');
      finger = touches[0];
    } else if (touches.length === 2) {
      start('touch');
      const [a, b] = touches;
      axes = axesAt((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
      lastScale = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    } else {
      finish();
    }
  }
  add('touchstart', (event) => {
    if (!read()) return;
    event.preventDefault();
    touchStart(event.touches);
  });
  add('touchmove', (event) => {
    if (stream !== 'pan' && stream !== 'touch') return;
    event.preventDefault();
    if (stream === 'touch' && event.touches.length === 2) {
      const [a, b] = event.touches;
      pinch(Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY));
    } else if (stream === 'pan' && event.touches.length === 1) {
      const current = event.touches[0];
      applyDelta(finger.clientX - current.clientX, finger.clientY - current.clientY);
      finger = current;
    }
  });
  add('touchend', (event) => {
    if (stream !== 'pan' && stream !== 'touch') return;
    event.preventDefault();
    touchStart(event.touches);
  });
  add('touchcancel', () => {
    if (stream === 'pan' || stream === 'touch') finish();
  });
  add('gesturestart', (event) => {
    if (!read()) return;
    event.preventDefault();
    if (stream === 'touch' || stream === 'pan') return;
    start('native');
    axes = axesAt(event.clientX, event.clientY);
    lastScale = event.scale || 1;
  });
  add('gesturechange', (event) => {
    if (!read()) return;
    event.preventDefault();
    if (stream === 'native') pinch(event.scale);
  });
  add('gestureend', (event) => {
    if (!read()) return;
    event.preventDefault();
    if (stream === 'native') finish();
  });
  return {
    reset,
    destroy() {
      listeners.abort();
      reset();
    }
  };
}

export function createTension(stage, block, prefersReduced) {
  const win = stage.ownerDocument.defaultView;
  const axes = [
    { value: 0, target: 0 },
    { value: 0, target: 0 }
  ];
  let frame = 0,
    previous = 0,
    handoff = null;
  const smooth = (t) => t * t * (3 - 2 * t);

  function paint() {
    const [x, y] = axes.map((axis) => axis.value);
    const bounded = (delta, size, room) =>
      Math.min(1 + delta, Math.max(1, (room * 0.99) / Math.max(1, size)));
    stage.style.transform =
      x || y
        ? 'scale(' +
          bounded(x - 0.14 * y, block.offsetWidth, stage.clientWidth) +
          ',' +
          bounded(y - 0.14 * x, block.offsetHeight, stage.clientHeight) +
          ')'
        : '';
  }

  function schedule() {
    if (!frame) frame = win.requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = 0;
    const dt = previous ? Math.max(0, now - previous) : 16;
    previous = now;
    let remaining = 0,
      pending = false;
    if (handoff) {
      const { animation, start, duration } = handoff;
      const t =
        animation.playState === 'idle' || animation.playState === 'finished'
          ? 1
          : Math.max(0, Math.min(1, ((animation.currentTime ?? start) - start) / duration));
      remaining = 1 - smooth(t);
    }
    axes.forEach((axis, index) => {
      if (handoff && handoff.from[index] !== null) axis.value = handoff.from[index] * remaining;
      else {
        axis.value += (axis.target - axis.value) * (1 - Math.exp(-dt / (axis.target ? 32 : 64)));
        if (Math.abs(axis.target - axis.value) < 0.00012) axis.value = axis.target;
        pending ||= axis.target !== axis.value;
      }
    });
    if (!remaining) handoff = null;
    paint();
    if (handoff || pending) schedule();
    else previous = 0;
  }

  function set(x, y) {
    if (prefersReduced.matches || stage.ownerDocument.hidden) return;
    [x, y].forEach((pressure, index) => {
      if (handoff && pressure) handoff.from[index] = null;
      axes[index].target =
        Math.sign(pressure) * (1 - (1 - Math.min(1, Math.abs(pressure))) ** 1.55) * 0.10225;
    });
    schedule();
  }

  function reset() {
    win.cancelAnimationFrame(frame);
    frame = previous = 0;
    handoff = null;
    for (const axis of axes) axis.target = axis.value = 0;
    stage.style.transform = '';
  }

  function commit() {
    for (const axis of axes) axis.target = 0;
    handoff = null;
    if (!axes.some((axis) => axis.value)) return;
    // Release the pull on the word animation's clock. The last word frame is
    // already at its final size, including when a scroll stream has momentum.
    let shortest = Infinity;
    for (const animation of stage.getAnimations({ subtree: true })) {
      if (animation.playState !== 'running' || animation.playbackRate <= 0) continue;
      const start = animation.currentTime ?? 0;
      const remaining = animation.effect.getComputedTiming().endTime - start;
      if (remaining <= 0 || remaining / animation.playbackRate >= shortest) continue;
      shortest = remaining / animation.playbackRate;
      handoff = {
        animation,
        start,
        duration: Math.min(remaining * 0.8, 97.3),
        from: axes.map((axis) => axis.value)
      };
    }
    if (handoff) schedule();
    else reset();
  }

  return { set, commit, reset, release: () => set(0, 0) };
}
