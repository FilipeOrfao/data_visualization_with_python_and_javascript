import nbviz from "./nbviz_core.mjs";

var chartHolder = d3.select("#nobel-time");

let margin = { top: 20, right: 20, bottom: 30, left: 40 };

let boundingRect = chartHolder.node().getBoundingClientRect();
let width = boundingRect.width - margin.left - margin.right,
  height = boundingRect.height - margin.top - margin.bottom;

let svg = chartHolder
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", width + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// SCALE
let xScale = d3
  .scaleBand()
  .range([0, width])
  .padding(0.1)
  .domain(d3.range(1901, 2025));

let yScale = d3.scaleBand().range([height, 0]).domain(d3.range(15));

// AXIS
let xAxis = d3
  .axisBottom()
  .scale(xScale)
  .tickValues(xScale.domain().filter((d, i) => !(d % 10)));

svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-65)");

// LABELS
let catLabels = chartHolder
  .select("svg")
  .append("g")
  .attr("class", "labels")
  .attr("transform", "translate(10, 10)")
  .selectAll("label")
  .data(nbviz.CATEGORIES)
  .join("g")
  .attr("transform", function (d, i) {
    return "translate(0," + i * 10 + ")";
  });

catLabels
  .append("circle")
  .attr("fill", nbviz.categoryFill)
  .attr("r", xScale.bandwidth() / 2);

catLabels
  .append("text")
  .text((d) => d)
  .attr("dy", "0.4em")
  .attr("x", 10);

let time_tooltip = d3.select("#time-tooltip");

let updateTimeChart = (data) => {
  let years = svg.selectAll(".year").data(data, (d) => d.key);
  years
    .join("g")
    .classed("year", true)
    .attr("name", (d) => d.key)
    .attr("transform", (year) => `translate(${xScale(+year.key)},0)`);

  let winners = svg
    .selectAll(".year")
    .selectAll("circle")
    .data(
      (d) => d.values,
      (d) => d.name
    );

  winners
    .join((enter) => enter.append("circle").attr("cy", height))
    .attr("fill", (d) => nbviz.categoryFill(d.category))
    .attr("cx", xScale.bandwidth() / 2)
    .attr("r", xScale.bandwidth() / 2)
    .attr("cy", (d, i) => yScale(1000))
    .transition()
    .duration(800)
    .attr("cy", (d, i) => yScale(i));

  svg
    .selectAll("circle")
    .on("mouseenter", function (event) {
      let winner = d3.select(this).datum();

      time_tooltip.select("h2").text(winner.name);
      time_tooltip.select("p").text(winner.category);
      time_tooltip.select(".name").text(winner.year);

      // time_tooltip.style("border-color", borderColor);

      let w = parseInt(time_tooltip.style("width")),
        h = parseInt(time_tooltip.style("height"));

      let mouseCoords = d3.pointer(event);
      time_tooltip.style("top", mouseCoords[1] - h - 10 + "px");
      // time_tooltip.style("left", mouseCoords[0] - w / 2 + "px");
      // time_tooltip.style("left", event.pageX + "px");
      time_tooltip.style("left", event.layerX - w / 2 + "px");
    })
    .on("mouseout", function (event, d) {
      time_tooltip.style("left", "-9999px");
      d3.select(this).classed("active", false);
    });
};

nbviz.callbacks.push(() => {
  let data = nbviz.nestDataByYear(nbviz.countryDim.top(Infinity));
  updateTimeChart(data);
});
