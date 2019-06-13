/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

type Props = {
  color: string,
  fromX: number,
  toX: number,
  lineWidth: number,
  y: number
};

export function Track(props: Props) {
  const { color, y, fromX, toX, lineWidth } = props;
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

Track.propTypes = {
  color: PropTypes.string,
  fromX: PropTypes.number,
  lineWidth: PropTypes.number,
  toX: PropTypes.number,
  y: PropTypes.number,
};

export default Track;
