/* @flow */

import Handle from './Handle';
import * as React from 'react';
import PropTypes from 'prop-types';
import useTouches from './useTouches';

type Props = {
  bg: string,
  centerY: number,
  colors: $ReadOnlyArray<string>,
  down: void | null | { controlled: number },
  innerRadius: number,
  onHandleStart: Function,
  onHandleMove: Function,
  onHandleAbort: Function,
  onHandleEnd: Function,
  strokeWidth: number,
  size: number,
  transformPosition: (number) => number,
  values: $ReadOnlyArray<number>
}

/**
 * Renders an array of handles and assigned event
 * handlers accordingly.
 */
export function HandleCollection(props: Props) { // eslint-disable-line complexity
  const {
    bg,
    centerY,
    colors,
    down,
    innerRadius,
    onHandleStart,
    onHandleMove,
    onHandleAbort,
    onHandleEnd,
    strokeWidth,
    size,
    transformPosition,
    values,
  } = props;
  const len = values.length;

  let handles = [];
  let handleOffset = values[0];// eslint-disable-line prefer-destructuring

  for (let hdlIdx = 1; hdlIdx < values.length; hdlIdx++) {
    let handleEvents = null;
    if (useTouches()) {
      if (!down) {
        handleEvents = {
          onTouchStart: onHandleStart.bind(null, hdlIdx),
        };
      } else if (down.controlled === hdlIdx) {
        handleEvents = {
          onTouchMove: onHandleMove,
          onTouchCancel: onHandleAbort,
          onTouchEnd: onHandleEnd,
        };
      }
    } else {
      handleEvents = {
        onMouseDown: onHandleStart.bind(null, hdlIdx),
      };
    }

    handles.push(
      <Handle
        key={hdlIdx}
        active={down && down.controlled === hdlIdx}
        bg={bg}
        color={colors[(hdlIdx - 1) % colors.length]}
        events={handleEvents}
        innerRadius={innerRadius}
        size={size}
        strokeWidth={strokeWidth}
        x={transformPosition(handleOffset)}
        y={centerY} />
    );

    handleOffset += values[hdlIdx];
  }

  /* Prevents handles from being blocked when last-in-order handles
     don't have space to move right. */
  if (len > 2 && values[len - 2] === 0 && values[len - 1] === 0) {
    let blockageIndex = len - 1;
    while (values[blockageIndex] === 0 && blockageIndex > 0) {
      blockageIndex--;
    }

    const freeHandles = handles.slice(0, blockageIndex);
    const lastInOrderBlockedHandles = handles.slice(blockageIndex);

    /* lift left-most handle to top */
    lastInOrderBlockedHandles.reverse();
    handles = freeHandles.concat(lastInOrderBlockedHandles);
  }

  return (
    <React.Fragment>
      {handles}
    </React.Fragment>
  );
}

HandleCollection.propTypes = {
  bg: PropTypes.string,
  centerY: PropTypes.number,
  colors: PropTypes.string,
  down: PropTypes.bool,
  innerRadius: PropTypes.number,
  onHandleStart: PropTypes.func,
  onHandleMove: PropTypes.func,
  onHandleAbort: PropTypes.func,
  onHandleEnd: PropTypes.func,
  strokeWidth: PropTypes.number,
  size: PropTypes.number,
  transformPosition: PropTypes.func,
  values: PropTypes.number,
};

export default HandleCollection;
