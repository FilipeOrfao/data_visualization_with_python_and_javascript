import nbviz from "./nbviz_core.mjs";

let chartHolder = d3.select("#nobel-birth-month");

let margin = { top: 20, right: 20, bottom: 30, left: 40 };

let boundingRect = chartHolder.node().getBoundingClientRect();
let width = boundingRect.width - margin.left - margin.right,
  height = boundingRect.height - margin.top - margin.bottom;
let xPaddingLeft = 20;

// SCALE
let xScale = d3.scaleBand().range([xPaddingLeft, width]).padding(0.1);

let yScale = d3.scaleLinear().range([height, 0]);

// AXES
let xAxis = d3.axisBottom().scale(xScale);

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

function updateBirthMonthBarChart(data) {
  //   data = data.filter((d) => d.value > 0);
  //   data = data.slice(0, 20);
  //   xScale.domain(data.map((d) => d.code));
  // yScale.domain([0, d3.max(data, (d) => +d.value)]);
  //   svg
  //     .select(".x.axis")
  //     .call(xAxis)
  //     .selectAll("text")
  //     .style("text-anchor", "end")
  //     .attr("dx", "-.8em")
  //     .attr("dy", ".15em")
  //     .attr("transform", "rotate(-65)");
  //   svg.select(".y.axis").call(yAxis);
  //   let bars = svg
  //     .selectAll(".bar")
  //     .data(data)
  //     .join((enter) =>
  //       enter.append("rect").attr("class", "bar").attr("x", xPaddingLeft)
  //     )
  //     .attr("x", (d) => xScale(d.code))
  //     .attr("width", xScale.bandwidth())
  //     .attr("y", (d) => yScale(0))
  //     .attr("height", (d) => height - yScale(0))
  //     .transition()
  //     .duration(800)
  //     .delay((d, i) => i * 10)
  //     .attr("y", (d) => yScale(d.value))
  //     .attr("height", (d) => height - yScale(d.value))
  //     .attr("value", (d) => d.value);
  //   svg.selectAll(".bar").on("mouseenter", function (e) {
  //     console.log(this.getAttribute("value"));
  //   });
}

nbviz.callbacks.push(() => {
  let data = nbviz.getLaureateBirthMonth();
  console.log(data);
  updateBirthMonthBarChart(data);
});
