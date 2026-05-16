let isDone = false;
const listeners: (() => void)[] = [];

export function onPreloaderDone(cb: () => void) {
  if (isDone) { cb(); return; }
  listeners.push(cb);
}

export function markPreloaderDone() {
  isDone = true;
  listeners.forEach((cb) => cb());
  listeners.length = 0;
}
