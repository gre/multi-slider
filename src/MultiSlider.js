var React = require("react");
var uncontrollable = require("uncontrollable");
var Handle = require("./Handle");
var Track = require("./Track");
var PropTypes = React.PropTypes;

function step (min, max, x) {
  return Math.max(0, Math.min((x-min)/(max-min), 1));
}

var MultiSlider = React.createClass({

  propTypes: {
    colors: PropTypes.arrayOf(PropTypes.string),
    values: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    padX: PropTypes.number,
    trackSize: PropTypes.number,
    handleSize: PropTypes.number,
    handleStrokeSize: PropTypes.number,
    handleInnerDotSize: PropTypes.number,
    bg: PropTypes.string
  },

  getDefaultProps: function () {
    return {
      colors: ["#000"], // define your own colors instead.
      handleSize: 16,
      padX: 20, // MUST be > handleSize to avoid clip issues
      width: 400,
      height: 80,
      trackSize: 6,
      handleStrokeSize: 3,
      handleInnerDotSize: 4,
      bg: "#fff"
    };
  },

  getInitialState: function () {
    return {
      down: null
    };
  },

  xForEvent: function (e) {
    var bound = this.getDOMNode().getBoundingClientRect();
    return e.clientX - bound.left;
  },

  sum: function () { // (might optimize this computation on values change if costy)
    return this.props.values.reduce(function (a,b) { return a + b; });
  },

  // map a value to an x position
  x: function (value) {
    var props = this.props;
    var width = props.width;
    var padX = props.padX;
    var sum = this.sum();
    return Math.round(padX + value * (width - 2 * padX) / sum);
  },

  reverseX: function (x) {
    var props = this.props;
    var width = props.width;
    var padX = props.padX;
    var sum = this.sum();
    return sum * ((x-padX) / (width - 2 * padX));
  },

  onHandleDown: function (i, e) {
    e.preventDefault();
    this.setState({
      down: {
        x: this.xForEvent(e),
        controlled: i
      }
    });
  },
  onHandleMove: function (e) {
    e.preventDefault();
    var x = this.xForEvent(e);
    var valuePos = this.reverseX(x);
    var width = this.props.width;
    var down = this.state.down;
    var values = this.props.values;
    var leftIndex = down.controlled-1;
    var rightIndex = down.controlled;
    var leftValue = values[leftIndex];
    var rightValue = values[rightIndex];
    var w = leftValue+rightValue;
    var offsetLeft = 0;
    for (var i=0; i<leftIndex; ++i)
      offsetLeft += values[i];
    var left = Math.round(w * step(offsetLeft, offsetLeft+w, valuePos));
    var right = w - left;

    if (left !== leftValue && right !== rightValue) {
      values = [].concat(values);
      values[leftIndex] = left;
      values[rightIndex] = right;
      this.props.onChange(values);
    }
  },
  onHandleUp: function (e) {
    this.setState({
      down: null
    });
  },
  onHandleLeave: function (e) {
    this.setState({
      down: null
    });
  },

  render: function () {
    var state = this.state;
    var down = state.down;
    var props = this.props;
    var width = props.width;
    var height = props.height;
    var values = props.values;
    var len = values.length;
    var colors = props.colors;
    var trackSize = props.trackSize;
    var handleSize = props.handleSize;
    var handleStrokeSize = props.handleStrokeSize;
    var handleInnerDotSize = props.handleInnerDotSize;
    var bg = props.bg;
    var padX = props.padX;
    var w =  width - 2*padX;
    var centerY = height / 2;
    var sum = this.sum();

    var tracks = [];
    var handles = [];
    var prev = 0;
    var prevColor = bg;
    for (var i=0; i<len; ++i) {
      var value = values[i];
      var next = prev + value;
      var fromX = this.x(prev);
      var toX = this.x(next);
      var color = colors[i % colors.length];
      tracks.push(
        <Track
          key={i}
          color={color}
          y={centerY}
          lineWidth={trackSize}
          fromX={fromX}
          toX={toX}
        />
      );
      if (i !== 0) {
        handles.push(
          <Handle
            key={i}
            active={down && down.controlled === i}
            x={fromX}
            y={centerY}
            bg={bg}
            color={prevColor}
            strokeWidth={handleStrokeSize}
            innerRadius={handleInnerDotSize}
            size={handleSize}
            onMouseDown={this.onHandleDown.bind(null, i)}
          />
        );
      }
      prev = next;
      prevColor = color;
    }
    // Specific case to avoid blocking the slider.
    if (len >= 3 && values[len-2]===0 && values[len-1]===0) {
      var reverseFromIndex;
      for (reverseFromIndex=len-1; values[reverseFromIndex]===0 && reverseFromIndex>0; reverseFromIndex--);
      var h1 = handles.slice(0, reverseFromIndex);
      var h2 = handles.slice(reverseFromIndex);
      h2.reverse();
      handles = h1.concat(h2);
    }
    var events = {};
    if (down) {
      events.onMouseMove = this.onHandleMove;
      events.onMouseUp = this.onHandleUp;
      events.onMouseLeave = this.onHandleLeave;
    }
    return <svg
      {...events}
      width={width}
      height={height}>
      {tracks}
      {handles}
    </svg>;
  }

});

module.exports = MultiSlider;
