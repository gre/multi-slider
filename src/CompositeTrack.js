/* @flow */

import PropTypes from 'prop-types';
import React from 'react';
import Track from './Track';

type Props = {
  colors: $ReadOnlyArray<string>,
  lineWidth: number,
  transformPosition: (number) => number,
  values: $ReadOnlyArray<number>,
  y: number
};

/**
 * Horizontally combines multiple {@code Track} components
 * to form one-long composite track.
 */
export function CompositeTrack(props: Props) {
  const { colors, lineWidth, transformPosition, values, y } = props;
  const builtTracks = [];

  let builtLength = 0;
  for (let valIdx = 0; valIdx < values.length; valIdx++) {
    const trackStart = builtLength;
    const trackEnd = builtLength + values[valIdx];
    const trackColor = colors[valIdx % colors.length];

    builtTracks.push(
      <Track
        color={trackColor}
        fromX={transformPosition(trackStart)}
        lineWidth={lineWidth}
        key={valIdx}
        toX={transformPosition(trackEnd)}
        y={y} />
    );

    builtLength = trackEnd;
  }

  return (
    <React.Fragment>
      {builtTracks}
    </React.Fragment>
  );
}

CompositeTrack.propTypes = {
  colors: PropTypes.string,
  lineWidth: PropTypes.number,
  transformPosition: PropTypes.func,
  values: PropTypes.array,
  y: PropTypes.number,
};

export default CompositeTrack;
