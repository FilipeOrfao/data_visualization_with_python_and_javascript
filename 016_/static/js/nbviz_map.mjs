import nbviz from "./nbviz_core.mjs";

let mapContainer = d3.select("#nobel-map");
let boundingRect = mapContainer.node().getBoundingClientRect();
let width = boundingRect.width,
  height = boundingRect.height;
let svg = mapContainer.append("svg");

// PROJECTION
let projection_eq = d3
  .geoEquirectangular()
  .scale(193 * (height / 480))
  .center([15, 15])
  .translate([width / 2, height / 2])
  .precision(0.1);

let projection_cea = d3
  .geoConicEqualArea()
  .center([0, 26])
  .scale(128)
  .translate([width / 2, height / 2])
  .precision(0.1);

let projection_ceq = d3
  .geoConicEquidistant()
  .center([0, 22])
  .scale(128)
  .translate([width / 2, height / 2])
  .precision(0.1);

let projection_merc = d3
  .geoMercator()
  .scale((width + 1) / 2 / Math.PI)
  .translate([width / 2, height / 2])
  .precision(0.1);

let projection = projection_eq;

// CREATE PATH WITH PROJECTION
let path = d3.geoPath().projection(projection);
// ADD GRATICULE
let graticule = d3.geoGraticule().step([20, 20]);

svg.append("path").datum(graticule).attr("class", "graticule").attr("d", path);

// A RADIUS SCALE FOR OUR CENTROID INDICATORS

let getCentroid = (d) => {
  let latlng = nbviz.data.countryData[d.name].latlng;
  return projection([latlng[1], latlng[0]]);
};

let radiusScale = d3
  .scaleSqrt()
  .range([nbviz.MIN_CENTROID_RADIUS, nbviz.MAX_CENTROID_RADIUS]);
// OBJECT TO MAP COUNTRY NAME TO GEOJSON OBJECT
let cnameToCountry = {};

export let initMap = function (world, names) {
  // EXTRACT OUT REQUIRED FEATRUES FROM THE TOPOJSON
  let land = topojson.feature(world, world.objects.land),
    countries = topojson.feature(world, world.objects.countries).features,
    borders = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

  // CREATE OBJECT MAPPING COUNTRY NAMES TO GEOJSON SHAPES
  let idToCountry = {};
  countries.forEach((c) => (idToCountry[c.id] = c));

  names.forEach((n) => (cnameToCountry[n.name] = idToCountry[n.id]));

  //MAIN WORLD MAP
  svg
    .insert("path", ".graticule")
    .datum(land)
    .attr("class", "land")
    .attr("d", path);

  // WINNING COUNTRIES
  svg.insert("g", ".graticule").attr("class", "countries");

  // COUNTRIES VALUE-INDICATORS
  svg.insert("g").attr("class", "centroids");

  // COUNDARY LINES
  svg
    .insert("path", ".graticule")
    // filter separates exterior from interior arcs...
    .datum(borders)
    .attr("class", "boundary")
    .attr("d", path);
};

let tooltip = d3.select("#map-tooltip");
let updateMap = (countryData) => {
  // console.log(countryData);
  let mapData = countryData
    .filter((d) => d.value > 0)
    .map((d) => {
      return {
        geo: cnameToCountry[d.key],
        name: d.key,
        number: d.value,
      };
    });

  let maxWinners = d3.max(mapData.map((d) => d.number));
  // DOMAIN OF VALUE-INDICATOR SCALE
  radiusScale.domain([0, maxWinners]);

  let countries = svg
    .select(".countries")
    .selectAll(".country")
    .data(mapData, (d) => d.name);

  countries
    .join(
      (enter) => {
        return enter
          .append("path")
          .attr("d", (d) => path(d.geo))
          .attr("class", "country")
          .attr("name", (d) => d.name)
          .on("mouseenter", function (event) {
            let country = d3.select(this);
            // don't do anything if the country is not visible
            if (!country.classed("visible")) {
              return;
            }

            // get the contry data object
            let cData = country.datum();
            // if only one prize, use singular 'prize'
            let prize_string =
              cData.number === 1 ? " prize in " : " prizes in ";
            // set the header and text of the tooltip
            tooltip.select("h2").text(cData.name);
            tooltip
              .select("p")
              .text(`${cData.number} ${prize_string} ${nbviz.activeCategory}`);

            // set the border color according to selected
            // prize category
            let borderColor =
              nbviz.activeCategory === nbviz.ALL_CATS
                ? "goldenrod"
                : nbviz.categoryFill(nbviz.activeCategory);
            tooltip.style("border-color", borderColor);

            let w = parseInt(tooltip.style("width")),
              h = parseInt(tooltip.style("height"));

            let mouseCoords = d3.pointer(event);
            tooltip.style("top", mouseCoords[1] - h + "px");
            tooltip.style("left", mouseCoords[0] - w / 2 + "px");

            d3.select(this).classed("active", true);
          })
          .on("mouseout", function (event, d) {
            tooltip.style("left", "-9999px");
            d3.select(this).classed("active", false);
          });
      },
      (update) => update,
      (exit) => {
        return exit
          .classed("visible", false)
          .transition()
          .duration(nbviz.TRANS_DURATION)
          .style("opacity", 0);
      }
    )
    .classed("visible", true)
    .transition()
    .duration(nbviz.TRANS_DURATION)
    .style("opacity", 1);

  // BIND MAP DATA WITH NAME KEY
  let centroids = svg
    .select(".centroids")
    .selectAll(".centroid")
    .data(mapData, (d) => d.name);

  // JOIN DATA TO CIRCLE INDICATORS
  centroids
    .join(
      (enter) => {
        return enter
          .append("circle")
          .attr("class", "centroid")
          .attr("name", (d) => d.name)
          .attr("cx", (d) => getCentroid(d)[0])
          .attr("cy", (d) => getCentroid(d)[1]);
      },
      (update) => update,
      (exit) => exit.style("opacity", 0)
    )
    .classed("active", (d) => d.name === nbviz.activeCountry)
    .transition()
    .duration(nbviz.TRANS_DURATION)
    .style("opacity", 1)
    .attr("r", (d) => radiusScale(+d.number));
};

nbviz.callbacks.push(() => {
  let data = nbviz.getCountryData();
  updateMap(data);
});
