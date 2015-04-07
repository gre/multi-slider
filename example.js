var React = require("react/addons");
var MultiSlider = require(".");
var packageJson = require("./package.json");

window.Perf = React.addons.Perf;

function hslPalette (n,s,l) {
  var c = [];
  for (var i=0; i<n; ++i) {
    c.push("hsl("+~~(255*i/n)+","+(s||"50%")+","+(l||"50%")+")");
  }
  return c;
}

var Example = React.createClass({

  getInitialState: function () {
    return {
      values: [48,29,23]
    };
  },

  onChange: function (values) {
    this.setState({
      values: values
    });
  },

  render: function () {
    return <div style={{ fontFamily: "sans-serif" }}>
      <p>
      <h1>{packageJson.name}</h1>
      <h2 style={{ color: "#555" }}>{packageJson.description}</h2>
      <pre><code>values={JSON.stringify(this.state.values)}</code></pre>
      <MultiSlider
        colors={["#FCBD7E","#EB9F71","#E6817C"]}
        values={this.state.values}
        onChange={this.onChange}
      />
      </p>
      <hr />
      <p>
      <MultiSlider
        defaultValues={[8, 1]}
      />
      </p>
      <p>
      <MultiSlider
        colors={hslPalette(4, "70%", "60%")}
        defaultValues={[1, 2, 8, 1]}
      />
      </p>
      <p>
      <MultiSlider
        colors={hslPalette(8, "70%")}
        defaultValues={[3,4,5,6,4,5,6,7]}
      />
      </p>
    </div>;
  }

});

React.render(<Example />, document.body);
