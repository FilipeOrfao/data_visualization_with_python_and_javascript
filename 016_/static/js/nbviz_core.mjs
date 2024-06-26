let nbviz = {};
nbviz.ALL_CATS = "All Categories";
nbviz.TRANS_DURATION = 2000;
nbviz.MAX_CENTROID_RADIUS = 30;
nbviz.MIN_CENTROID_RADIUS = 2;
nbviz.COLORS = { palegold: "#E6BE8A" };

nbviz.data = {};
nbviz.valuePerCapita = 0;
nbviz.activeCountry = null;
nbviz.activeCategory = nbviz.ALL_CATS;

nbviz.CATEGORIES = [
  "Chemistry",
  "Economics",
  "Literature",
  "Peace",
  "Physics",
  "Physiology or Medicine",
];

nbviz.categoryFill = (category) => {
  var i = nbviz.CATEGORIES.indexOf(category);
  return d3.schemaCategory10[i];
};

let nestDataByYear = (entries) => {};

nbviz.makeFilterAndDimensions = (entries) => {};

nbviz.filterByCountries = (entries) => {};

nbviz.filterByCategory = (entries) => {};

nbviz.getCountryData = (entries) => {};

nbviz.calbacks = [];

nbviz.onDataChange = function () {
  nbviz.calbacks.forEach((cb) => cb());
};

export default nbviz;
