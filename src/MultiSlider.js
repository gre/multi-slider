/* @flow */

import CompositeTrack from './CompositeTrack';
import * as React from 'react';
import HandleCollection from './HandleCollection';
import useTouches from './useTouches';
import PropTypes from 'prop-types';

function step(min, max, x) {
  return Math.max(0, Math.min((x - min) / (max - min), 1));
}

type Props = {
  bg: string,
  colors: $ReadOnlyArray<string>,
  handleSize: number,
  handleStrokeSize: number,
  handleInnerDotSize: number,
  height: number,
  onChange: ($ReadOnlyArray<number>) => void,
  padX: number,
  trackSize: number,
  values: $ReadOnlyArray<number>,
  width: number
};

type State = {
  down: void | null | { controlled: number, touchId: number }
};

export default class MultiSlider extends React.Component<Props, State> {
  static defaultProps = {
    colors: [ '#000' ], // define your own colors instead.
    handleSize: 16,
    padX: 20, // MUST be > handleSize to avoid clip issues
    width: 400,
    height: 80,
    trackSize: 6,
    handleStrokeSize: 3,
    handleInnerDotSize: 4,
    bg: '#fff',
  };

  state = {
    down: null,
  };

  root: React.Element<'svg'>;

  /**
   * Transforms the {@code clientX} coordinate of the
   * event into its corresponding value in the viewbox
   * coordinate field (rather than displayed coordinates).
   *
   * @param {SyntheticEvent} event - touch/mouse event
   * @return viewbox x-coordinate for the event's clientX
   */
  xForEvent(event: SyntheticEvent<>) {
    const node: any = this.root;
    const currentMatrix = node.getScreenCTM();

    let point = node.createSVGPoint();
    point.x = (event: any).clientX;
    point = point.matrixTransform(currentMatrix.inverse());

    return point.x;
  }

  /**
   * Calculates the horizontal offset of the {@code index}th
   * handle. There are {@code index + 1} tracks before this
   * handle.
   *
   * If index is not provided, the sum of all tracks will
   * be provided; however, a handle need not exist at that
   * position (the very end).
   *
   * @param {number} index - index of handle
   * @return h-offset of handle at index provided; if not,
   *   cumulated track sizes.
   */
  offsetTill(index: number = this.props.values.length - 1) {
    let cumulatedOffset = 0;
    for (let i = 0; i <= index; i++) {
      cumulatedOffset += this.props.values[i];
    }
    return cumulatedOffset;
  }

  /**
   * Map a handle offset in {@code values} array terms into
   * its horizontal offset on this slider's track in terms
   * of the SVG viewbox.
   */
  x = (value: number) => {
    const { padX, width } = this.props;
    const offsetTill = this.offsetTill();
    return Math.round(padX + value * (width - 2 * padX) / offsetTill);
  }

  /**
   * Map a horizontal offset on this slider's track in SVG
   * viewbox terms into this offset in {@code values} array
   * terms. It is the reverse of {@code MultiSlider#x}.
   */
  reverseX(x: number) {
    const { padX, width } = this.props;
    const offsetTill = this.offsetTill();
    return offsetTill * ((x - padX) / (width - 2 * padX));
  }

  /**
   * If the provided event is touch-related, finds the
   * {@code Touch} object that corresponds to the pressed
   * handle. Otherwise, returns the event as-is.
   *
   * @param {Event} e - captured event
   */
  concernedEvent = (e: any) => {
    if (!useTouches()) {
      return e;
    }

    const { down } = this.state;
    if (!down) {
      return e.targetTouches[0];
    }

    const { touchId } = down;
    const touches = e.changedTouches;

    for (let i = 0; i < touches.length; ++i) {
      if (touches[i].identifier === touchId) {
        return touches[i];
      }
    }

    return null;
  };

  onHandleStart = (handleIndex: number, e: SyntheticEvent<>) => {
    const event = this.concernedEvent(e);
    if (!event) {
      return;
    }
    e.preventDefault();

    this.setState({
      down: {
        touchId: event.identifier,
        x: this.xForEvent(event),
        controlled: handleIndex,
      },
    });
  };

  onHandleMove = (e: SyntheticEvent<>) => {
    const { down } = this.state;
    if (!down) {
      throw new Error('this.state.down is not initialized, even though ' +
        'a move event has already been fired!');
    }

    const event = this.concernedEvent(e);
    if (!event) {
      return;
    }
    e.preventDefault();

    const x = this.xForEvent(event);
    const valuePos = this.reverseX(x);
    let { values } = this.props;

    const leftIndex = down.controlled - 1;
    const rightIndex = down.controlled;
    const leftValue = values[leftIndex];
    const rightValue = values[rightIndex];
    const width = leftValue + rightValue;
    const offsetLeft = this.offsetTill(leftIndex - 1);

    const left = Math.round(
      width * step(offsetLeft, offsetLeft + width, valuePos));
    const right = width - left;
    if (left !== leftValue && right !== rightValue) {
      values = [].concat(values);
      values[leftIndex] = left;
      values[rightIndex] = right;
      this.props.onChange(values);
    }
  };

  onHandleEnd = (e: SyntheticEvent<>) => {
    const event = this.concernedEvent(e);
    if (!event) {
      return;
    }
    this.setState({
      down: null,
    });
  };

  onHandleAbort = (e: SyntheticEvent<>) => {
    const event = this.concernedEvent(e);
    if (!event) {
      return;
    }
    this.setState({
      down: null,
    });
  };

  render() {
    const { down } = this.state;
    const { colors, values } = this.props;
    const centerY = this.props.height / 2;

    const svgContainerEvents = (!useTouches() && down) ? {
      onMouseMove: this.onHandleMove,
      onMouseUp: this.onHandleEnd,
      onMouseLeave: this.onHandleAbort,
    } : {};

    return (
      <svg ref={(node: any) => {
        this.root = node;
      }}
      {...svgContainerEvents}
      width="100%"
      height="100%"
      viewBox={`0 0 ${ this.props.width } ${ this.props.height }`}>

        <CompositeTrack
          colors={colors}
          lineWidth={this.props.trackSize}
          transformPosition={this.x}
          values={values}
          y={centerY} />
        <HandleCollection
          bg={this.props.bg}
          centerY={centerY}
          colors={colors}
          down={this.state.down}
          innerRadius={this.props.handleInnerDotSize}
          onHandleStart={this.onHandleStart}
          onHandleMove={this.onHandleMove}
          onHandleAbort={this.onHandleAbort}
          onHandleEnd={this.onHandleEnd}
          strokeWidth={this.props.handleStrokeSize}
          size={this.props.handleSize}
          transformPosition={this.x}
          values={values} />
      </svg>
    );
  }
}

MultiSlider.propTypes = {
  /**
   * Background color of handles.
   *
   * @default '#FFF' (white)
   */
  bg: PropTypes.string,
  /**
   * Array of colors mapping to each track.
   */
  colors: PropTypes.arrayOf(PropTypes.string),
  /**
   * Relative size of handles.
   */
  handleSize: PropTypes.number,
  /**
   * Relative width of the drawn boundary of handles. This
   * is drawn inside the handle's circle.
   */
  handleStrokeSize: PropTypes.number,
  /**
   * Relative radius of inner-dot drawn in each handle.
   */
  handleInnerDotSize: PropTypes.number,
  /**
   * Height of this component's viewbox. All other y coordinates
   * are relative to this height.
   */
  height: PropTypes.number,
  /**
   * Handler invoked whenever a handle's position is shifted
   * by the user, regardless of whether it has been lifted.
   */
  onChange: PropTypes.func,
  /**
   * Padding on left & right ends of track relative to
   * width (not values).
   */
  padX: PropTypes.number,
  /**
   * Thickness of tracks
   */
  trackSize: PropTypes.number,
  /**
   * Each handle's separation from its predecessor; with
   * the first one's being from the track's beginning. These
   * separations are relative and are scaled to the actual
   * viewbox.
   */
  values: PropTypes.arrayOf(PropTypes.number),
  /**
   * Width of this component's viewbox. All other x coordinates are
   * relative to this width.
   */
  width: PropTypes.number,
};
