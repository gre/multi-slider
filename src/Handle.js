/* @flow */

import PropTypes from 'prop-types';
import * as React from 'react';
import objectAssign from 'object-assign';
import useTouches from './useTouches';

const BGDISK_ACTIVE = 0;
const BGDISK_HOVER = 0.8;
const BGDISK_NORMAL = 1;

type Props = {
  active: boolean,
  bg: string,
  color: string,
  events: $ReadOnlyArray<any>,
  innerRadius: number,
  size: number,
  strokeWidth: number,
  x: number,
  y: number,
};

type State = {
  hover: boolean
};

export default class Handle extends React.Component<Props, State> {
  state = {
    hover: false,
  };

  hoverIn = () => {
    this.setState({
      hover: true,
    });
  }

  hoverOut = () => {
    this.setState({
      hover: false,
    });
  }

  render() {
    const { hover } = this.state;
    const {
      active,
      bg,
      color,
      innerRadius,
      size,
      strokeWidth,
      x,
      y,
    } = this.props;

    const events = objectAssign(
      useTouches() ?
        {} :
        {
          onMouseEnter: this.hoverIn,
          onMouseLeave: this.hoverOut,
        },
      this.props.events
    );

    return (
      <g style={{
        cursor: active ? 'ew-resize' : 'pointer',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      }}
      {...events}>
        <circle key="fullDisk"
          cx={x}
          cy={y}
          r={size}
          fill={color} />
        <circle key="bgDisk"
          opacity={
            active ? BGDISK_ACTIVE : (
              hover ? BGDISK_HOVER :
                BGDISK_NORMAL
            )}
          cx={x}
          cy={y}
          r={size - strokeWidth}
          fill={bg} />
        <circle key="innerDot"
          cx={x}
          cy={y}
          r={innerRadius}
          fill={active ? bg : color} />
      </g>
    );
  }
}

Handle.propTypes = {
  active: PropTypes.bool,
  bg: PropTypes.string,
  color: PropTypes.string,
  events: PropTypes.array,
  innerRadius: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};
