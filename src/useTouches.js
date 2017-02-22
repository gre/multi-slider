
var _touches = typeof window !== "undefined" && "ontouchstart" in window;

module.exports = function () {
  return _touches;
};
