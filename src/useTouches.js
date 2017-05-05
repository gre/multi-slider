var _touches = typeof window !== "undefined" && "ontouchstart" in window;
export default () => _touches;
