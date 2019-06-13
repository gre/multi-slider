/* whether or not touch events are available on this system. */
const touchesAvail = (typeof window !== 'undefined') && 'ontouchstart' in window;

/**
 * Returns whether this system uses touch events.
 *
 * @name useTouches()
 */
export default () => touchesAvail;
