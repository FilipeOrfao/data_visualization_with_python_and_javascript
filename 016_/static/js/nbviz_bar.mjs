import nbviz from "./nbviz_core.mjs";

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
let xPaddingLeft = 20;

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

// SCALE
let xScale = d3.scaleBand().range([xPaddingLeft, width]).padding(0.1);

let yScale = d3.scaleLinear().range([height, 0]);

// AXES
let xAxis = d3.axisBottom().scale(xScale);

// let yAxis = d3
//   .axisLeft()
//   .scale(yScale)
//   .ticks(10)
//   .tickFormat((d) => (nbviz.valuePerCapita ? d.toExponential() : d));

let yAxis = d3
  .axisLeft()
  .scale(yScale)
  .ticks(10)
  .tickFormat(function (d) {
    if (nbviz.valuePerCapita) {
      return d.toExponential();
    }
    return d;
  });

let svg = chartHolder
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .classed("chart", true)
  .attr("transform", `translate(${margin.left},${margin.top})`);

// ASS AXES
svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");

svg
  .append("g")
  .attr("class", "y axis")
  .append("text")
  .attr("id", "y-axis-label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Number of winners");

// updateBarChart(nobelData);
let country_tooltip = d3.select("#bar-tooltip");
function updateBarChart(data) {
  data = data.filter((d) => d.value > 0);
  data = data.slice(0, 20);
  xScale.domain(data.map((d) => d.code));

  yScale.domain([0, d3.max(data, (d) => +d.value)]);

  svg
    .select(".x.axis")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  svg.select(".y.axis").call(yAxis);

  let bars = svg
    .selectAll(".bar")
    .data(data)
    .join((enter) =>
      enter.append("rect").attr("class", "bar").attr("x", xPaddingLeft)
    )
    .attr("x", (d) => xScale(d.code))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(0))
    .attr("height", (d) => height - yScale(0))
    .transition()
    .duration(800)
    .delay((d, i) => i * 10)
    .attr("y", (d) => yScale(d.value))
    .attr("height", (d) => height - yScale(d.value))
    .attr("value", (d) => d.value)
    .attr("country", (d) => d.code);
  console.log(data);
  svg
    .selectAll(".bar")
    .on("mouseenter", function (e) {
      let bar_info = d3.select(this).datum();

      country_tooltip.select("h2").text(bar_info.key);
      country_tooltip.select("p").text(bar_info.value);

      d3.select(this).classed("active", true);

      country_tooltip
        .style("left", e.layerX - 20 + "px")
        .style("top", e.layerY - 80 + "px");
    })
    .on("mouseout", function (e) {
      country_tooltip.style("left", "-9999px");
      // month_tooltip.style("visl", "-9999px");
      d3.select(this).classed("active", false);
    });
}

nbviz.callbacks.push(() => {
  let data = nbviz.getCountryData();
  updateBarChart(data);
});

// make it with this animation
// https://d3-graph-gallery.com/graph/barplot_animation_start.html
// https://d3-graph-gallery.com/index.html
