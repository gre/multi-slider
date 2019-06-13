import React from 'react';
import { render } from 'react-dom';
import MultiSlider from 'multi-slider';
import packageJson from 'multi-slider/package.json';

function hslPalette(n, s, l) {
  const c = [];
  for (let i = 0; i < n; ++i) {
    c.push(
      `hsl(${ ~~(255 * i / n) },${ s || '50%' },${ l || '50%' })`
    );
  }
  return c;
}

class Example extends React.Component {
  state = {
    values: [ 48, 29, 23 ],
  };

  onChange = (values) =>
    this.setState({
      values,
    });

  render() {
    const colors = [ '#FCBD7E', '#EB9F71', '#E6817C' ];
    return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <div>
          <h1>{packageJson.name}</h1>
          <h2 style={{ color: '#555' }}>{packageJson.description}</h2>
          <pre>
            <code>
              values=
              {JSON.stringify(this.state.values)}
              {' '}
              colors=
              {JSON.stringify(colors)}
            </code>
          </pre>
          <MultiSlider
            colors={colors}
            values={this.state.values}
            onChange={this.onChange}
          />
        </div>
        <hr />
        <div style={{ width: '400px' }}>
          <MultiSlider defaultValues={[ 8, 1 ]} />
        </div>
        <div style={{ width: '400px' }}>
          <MultiSlider
            colors={hslPalette(4, '70%', '60%')}
            defaultValues={[ 1, 2, 8, 1 ]}
          />
        </div>
        <div style={{ width: '400px' }}>
          <MultiSlider
            colors={hslPalette(8, '70%')}
            defaultValues={[ 3, 4, 5, 6, 4, 5, 6, 7 ]}
          />
        </div>
      </div>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
render(<Example />, container);
