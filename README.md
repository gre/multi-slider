# multi-slider
React component for multiple values slider (allocate values).

[![](https://nodei.co/npm/multi-slider.png)](https://www.npmjs.com/package/multi-slider)

[![](https://cloud.githubusercontent.com/assets/211411/7025093/7d3dae78-dd41-11e4-9ff8-8f3e2e2d12bc.png)](http://gre.github.io/multi-slider)

## Description

`MultiSlider` is a slider that allows multiple data points to be controlled on
the same line. It composes two sub-components: the `Handle` and the `Track`.

By default, the `Handle` is a white circle with a colored boundary and an inner
dot. It can be pressed and dragged by the user.

A `Track` is the horizontal line between two handles (or the edges). The
combination of all tracks is called the "composed" track (term given due to
the `CompositeTrack` internal-component).

* The relative separations between handles are given by the `values` prop. To
construct this array, you have to take the difference between each handle's
offset. You must also include the first & last handles' separation from the
composed track's ends.

`values = diff([0, ...handleOffsets, cumulativeTrackLength])`.

* These values are independent from the `width` (also `height`) prop. As
`MultiSlider` uses SVG internally, the `width` prop the SVG root element's
viewbox's width.

* Colors for each track & handle are given using the `colors` prop.

* Steps: `MultiSlider` requires that your handles are at integer offsets in
the `values` prop. The user cannot drag them into a non-integer offset. Hence,
to reduce the step-size of your data-point, you can scale them to higher values,
e.g. multiply them by 100 (unless they are already that high).

## Usage

```
import MultiSlider from 'multi-slider';
```

Props:

`bg`

Background color for handles


`colors`

Array of colors to use on each track. If the number of colors is less than the
number of values provided, the colors will be cycled through.

`handleSize`:

Relative radius of the handles.

`handleStrokeSize`

Relative width of the drawn boundary of handles. This
is drawn inside the handle's circle.

`handleInnerDotSize`

Radius of the inner dot in the handle.

`height`:

Height of this component's viewbox. All other y coordinates
are relative to this height.

`onChange`:

Handler invoked whenever a handle's position is shifted
by the user, regardless of whether it has been lifted.

`padX`

Padding on left & right ends of track relative to
width (not values).

`trackSize`

Thickness of tracks

`values`

Each handle's separation from its predecessor; with
the first one's being from the track's beginning. These
separations are relative and are scaled to the actual
viewbox.

`width`

Width of this component's viewbox. All other x (except values) coordinates are
relative to this width.

## Develop and run example

```
npm install
```

```
npm run example
```
