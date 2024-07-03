import nbviz from "./nbviz_core.mjs";

let mapContainer = d3.select("#nobel-map");
let boundingRect = mapContainer.node().getBoundingClientRect();
let width = boundingRect.width,
  height = boundingRect.height;
let svg = mapContainer.append("svg");

// PROJECTION
let projection = d3
  .geoEquirectangular()
  .scale(193 * (height / 480))
  .center([15, 15])
  .translate([width / 2, height / 2])
  .precision(0.1);

// CREATE PATH WITH PROJECTION
let path = d3.geoPath().projection(projection);
// ADD GRATICULE
let graticule = d3.geoGraticule().step([20, 20]);
svg.append("path").datum(graticule).attr("class", "graticule").attr("d", path);
// A RADIUS SCALE FOR OUR CENTROID INDICATORS
let radiusScale = d3
  .scaleSqrt()
  .range([nbviz.MIN_CENTROID_RADIUS, nbviz.MAX_CENTROID_RADIUS]);
// OBJECT TO MAP COUNTRY NAME TO GEOJSON OBJECT
let cnameToCountry = {};

let getCentroid = (d) => {
  let latlng = nbviz.data.countryData[d.name].latlng;
  return projection([latlng[1], latlng[0]]);
};

export let initMap = function (world, names) {
  // EXTRACT OUT REQUIRED FEATRUES FROM THE TOPOJSON
  let land = topojson.feature(world, world.objects.land),
    countries = topojson.feature(world, world.objects.countries).features,
    borders = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);
  // CREATE OBJECT MAPPING COUNTRY NAMES TO GEOJSON SHAPES
  let idToCountry = {};
  countries.forEach((c) => idToCountry[(c.id = c)]);

  names.forEach((n) => (cnameToCountry[n.name] = idToCountry[n.id]));
  //MAIN WORLD MAP
  svg
    .insert("path", ".graticule")
    .datum(land)
    .attr("class", "land")
    .attr("d", path);
  // COUNTRIES VALUE-INDICATORS
  svg.insert("g").attr("class", "centroids");
  // COUNDARY LINES
  svg
    .insert("path", ".graticule")
    .datum(borders)
    .attr("class", "boundary")
    .attr("d", path);
};

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

  let radiusScale = d3
    .scaleSqrt()
    .range([(nbviz.MIN_CENTROID_RADIUS, nbviz.MAX_CENTROID_RADIUS)]);

  let maxWinners = d3.max(mapData.map((d) => d.number));
  // DOMAIN OF VALUE-INDICATOR SCALE
  radiusScale.domain([0, maxWinners]);

  let countries = svg
    .select(".countries")
    .selectAll(".country")
    .data(mapData, (d) => d.name);

  countries
    .join(
      function (enter) {
        enter
          .append("path")
          .attr("d", (d) => path(d.geo))
          .attr("class", "country")
          .attr("name", (d) => d.name)
          .on("mouseenter", function (event, d) {
            d3.select(this).classed("active", true);
          })
          .on("mouseout", function (event, d) {
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
};

nbviz.callbacks.push(() => {
  let data = nbviz.getCountryData();
  updateMap(data);
});
