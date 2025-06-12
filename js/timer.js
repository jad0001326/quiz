

// Simple countdown timer utility.
// startTimer(seconds, onTick, onEnd):
//   seconds  – total time in seconds
//   onTick   – function called every second with remaining seconds
//   onEnd    – function called when countdown reaches zero
export function startTimer(seconds, onTick, onEnd) {
  let t = seconds;
  onTick(t);                     // initial tick

  const id = setInterval(() => {
    t -= 1;
    onTick(t);
    if (t <= 0) {
      clearInterval(id);
      onEnd();
    }
  }, 1000);

  // return a function to cancel the timer early if needed
  return () => clearInterval(id);
}
