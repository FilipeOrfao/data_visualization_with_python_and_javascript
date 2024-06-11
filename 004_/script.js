let charCircles = (data) => {
  let chart = d3.select("#js-chart");
  //   set the char height and width from data
  chart.attr("height", data.height).attr("width", data.width);
  //   create some circles using the data
  chart
    .selectAll("circle")
    .data(data.circles)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r);
};

let data = {
  width: 300,
  height: 150,
  circles: [
    { x: 50, y: 30, r: 20 },
    { x: 70, y: 80, r: 10 },
    { x: 160, y: 60, r: 10 },
    { x: 200, y: 100, r: 5 },
  ],
};

charCircles(data);
