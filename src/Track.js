var React = require("react");

class Track extends React.Component {
  render () {
    var props = this.props;
    var color = props.color;
    var y = props.y;
    var fromX = props.fromX;
    var toX = props.toX;
    var lineWidth = props.lineWidth;
    return <line
      x1={fromX}
      x2={toX}
      y1={y}
      y2={y}
      strokeWidth={lineWidth}
      stroke={color}
      strokeLinecap="round"
    />;
  }
};

module.exports = Track;
