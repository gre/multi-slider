import React from "react";

export default class Track extends React.Component {
  render() {
    const { color, y, fromX, toX, lineWidth } = this.props;
    return (
      <line
        x1={fromX}
        x2={toX}
        y1={y}
        y2={y}
        strokeWidth={lineWidth}
        stroke={color}
        strokeLinecap="round"
      />
    );
  }
}
