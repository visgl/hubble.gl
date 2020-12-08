import window from 'global/window';

/**
 * Implements the requestAnimationFrame + customEvent approach for throttling
 * window.resize events as described in:
 *    https://developer.mozilla.org/en-US/docs/Web/Events/resize
 */
export function throttleResize() {
  const throttle = (type, name, obj) => {
    obj = obj || window;
    let running = false;
    const handler = () => {
      if (running) {
        return;
      }
      running = true;
      window.requestAnimationFrame(() => {
        // eslint-disable-next-line no-undef
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, handler);
  };

  /* init - you can init any event */
  throttle('resize', 'optimizedResize');
}
