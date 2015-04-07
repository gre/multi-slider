var React = require("react");

var Handle = React.createClass({

  getInitialState: function () {
    return {
      hover: false
    };
  },

  hoverIn: function () {
    this.setState({
      hover: true
    });
  },

  hoverOut: function () {
    this.setState({
      hover: false
    });
  },

  render: function () {
    var state = this.state;
    var hover = state.hover;
    var props = this.props;
    var active = props.active;
    var x = props.x;
    var y = props.y;
    var size = props.size;
    var strokeWidth = props.strokeWidth;
    var innerRadius = props.innerRadius;
    var bg = props.bg;
    var color = props.color;
    var events = {
      onMouseDown: props.onMouseDown,
      onMouseEnter: this.hoverIn,
      onMouseLeave: this.hoverOut
    };

    return <g {...events}>
      <circle
        key="1"
        cx={x}
        cy={y}
        r={size}
        fill={color}
      />
      <circle
        key="2"
        opacity={active ? 0 : (hover ? 0.8 : 1)}
        cx={x}
        cy={y}
        r={size-strokeWidth}
        fill={bg}
      />
      <circle
        key="3"
        cx={x}
        cy={y}
        r={innerRadius}
        fill={active ? bg : color}
      />
    </g>;
  }
});

module.exports = Handle;
