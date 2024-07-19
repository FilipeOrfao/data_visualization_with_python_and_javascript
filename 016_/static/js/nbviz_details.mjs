import nbviz from "./nbviz_core.mjs";

let updateList = function (data) {
  let tableBody, rows, cells;
  // Sort the winners data
  data = data.sort((a, b) => +b.year - +a.year);

  // select table-body from index.html
  tableBody = d3.select("#nobel-list tbody");
  // create place-holder rows bound to winners data
  rows = tableBody.selectAll("tr").data(data);

  rows.join(
    (enter) => {
      // create any new rows required
      enter.append("tr").on("click", function (event, d) {
        // console.log("You clicked a row" + JSON.stringify(d));
        displayWinner(d);
      });
    },
    (update) => update,
    (exit) =>
      exit
        .transition()
        .duration(nbviz.TRANS_DURATION)
        .style("opacity", 0)
        .remove()
  );

  cells = tableBody
    .selectAll("tr")
    .selectAll("td")
    .data((d) => [d.year, d.category, d.name]);

  // Append data cells, then set their text
  cells.join("td").text((d) => d);
  // display a random winner if data in available
  if (data.length)
    displayWinner(data[Math.floor(Math.random() * data.length)]);
};

let displayWinner = function (wData) {
  // store the winners bio-box element
  let nw = d3.select("#nobel-winner");

  nw.select("#winner-title").text(wData.name);
  nw.style("border-color", nbviz.categoryFill(wData.category));

  nw.selectAll(".property span").text(function (d) {
    let property = d3.select(this).attr("name");
    return wData[property];
  });

  nw.select("#biobox").html(wData.mini_bio);
  // add an imbage if available, otherwise remove the old one

  if (wData.bio_image) {
    nw.select("#picbox img")
      //   .attr("src", "static/images/winners/" + wData.bio_image)
      .attr("src", "static/images/winners/" + wData.bio_image)
      .style("display", "inline");
  } else {
    nw.select("#picbox img").style("display", "none");
  }

  nw.select("#readmore a").attr(
    "href",
    "http://en.wikipedia.org/wiki/" + wData.name
  );
};

nbviz.callbacks.push(() => {
  let data = nbviz.countryDim.top(Infinity);
  updateList(data);
});
