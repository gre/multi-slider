var React = require("react");
var objectAssign = require("object-assign");
var useTouches = require("./useTouches");

class Handle extends React.Component {

  state = {
      hover: false
  }

  hoverIn = () =>
    this.setState({
      hover: true
    })

  hoverOut = () =>
    this.setState({
      hover: false
    })

  render () {
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
    var events = objectAssign(useTouches() ? {} : {
      onMouseEnter: this.hoverIn,
      onMouseLeave: this.hoverOut
    }, props.events);
    var style = {
      cursor: active ? "ew-resize" : "pointer",
      WebkitTapHighlightColor: "rgba(0,0,0,0)"
    };

    return <g style={style} {...events}>
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
}

module.exports = Handle;
