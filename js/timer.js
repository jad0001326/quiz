// Simple countdown timer utility.
// startTimer(seconds, onTick, onEnd):
//   seconds  – total time in seconds
//   onTick   – function called every second with remaining seconds
//   onEnd    – function called when countdown reaches zero
export function startTimer(seconds, onTick, onEnd) {
  // Basic arg validation
  if (typeof onTick !== 'function' || typeof onEnd !== 'function') {
    throw new TypeError('startTimer expects onTick and onEnd callback functions');
  }

  // If seconds is non‑positive, fire handlers immediately and return a noop cancel fn
  if (typeof seconds !== 'number' || seconds <= 0) {
    onTick(0);
    onEnd();
    return () => {};
  }

  let t = seconds;
  onTick(t); // initial tick

  const id = setInterval(() => {
    t -= 1;
    onTick(t);
    if (t <= 0) {
      clearInterval(id);
      onEnd();
    }
  }, 1000);

  // Return a function that cancels the countdown early
  return () => clearInterval(id);
}
