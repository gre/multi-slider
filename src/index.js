var MultiSlider = require("./MultiSlider");
var uncontrollable = require("uncontrollable");
module.exports = uncontrollable(MultiSlider, { values: "onChange" });
