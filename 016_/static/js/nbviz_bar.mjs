import nbviz from "./nbviz_core.mjs";

nbviz.callbacks.push(() => {
  let data = nbviz.getCountryData();
  updateBarChart(data);
});

// let nobelData = [
//   { key: "United States", value: 336, code: "USA" },
//   { key: "United Kingdom", value: 98, code: "GBR" },
//   { key: "Germany", value: 79, code: "DEU" },
//   { key: "France", value: 60, code: "FRA" },
//   { key: "Sweden", value: 29, code: "SWE" },
//   { key: "Switzerland", value: 23, code: "CHE" },
//   { key: "Japan", value: 21, code: "Jpn" },
//   { key: "Russia", value: 19, code: "RUS" },
//   { key: "Netherlands", value: 17, code: "NLD" },
//   { key: "Austria", value: 14, code: "AUT" },
// ];

let chartHolder = d3.select("#nobel-bar");

let margin = { top: 20, right: 20, bottom: 30, left: 40 };

let boundingRect = chartHolder.node().getBoundingClientRect();
let width = boundingRect.width - margin.left - margin.right,
  height = boundingRect.height - margin.top - margin.bottom;

// let barWidth = width / nobelData.length;

// let svg = d3
//   .select("#nobel-bar")
//   .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", width + margin.top + margin.bottom)
//   .append("g")
//   .classed("chart", true)
//   .attr("tranform", `translate(${margin.left},${margin.top})`);

// nobelData.forEach((d, i) => {
//   svg
//     .append("rect")
//     .classed("bar", true)
//     .attr("height", d.value)
//     .attr("width", barWidth)
//     .attr("y", height - d.value)
//     .attr("x", i * barWidth);
// });

let xPaddingLeft = 20;

let xScale = d3.scaleBand().range([xPaddingLeft, width]).padding(0.1);

let yScale = d3.scaleLinear().range([height, 0]);

let svg = chartHolder
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", width + margin.top + margin.bottom)
  .append("g")
  .classed("chart", true)
  .attr("tranform", `translate(${margin.left},${margin.top})`);

// updateBarChart(nobelData);

function updateBarChart(data) {
  data = data.filter((d) => d.value > 0);

  xScale.domain(data.map((d) => d.code));

  yScale.domain([0, d3.max(data, (d) => d.value)]);

  let bars = svg
    .selectAll(".bar")
    .data(data)
    .join((enter) =>
      enter.append("rect").attr("class", "bar").attr("x", xPaddingLeft)
    )
    .attr("x", (d) => xScale(d.code))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d.value))
    .attr("height", (d) => height - yScale(d.value));
}
