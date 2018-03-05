function isTouchDevice() {
  return 'ontouchstart' in document.documentElement;
}

function isGracePeriod(points) {
  return (points + 1) % 10 <= 1 && points > 0;
}
