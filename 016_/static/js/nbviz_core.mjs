let nbviz = {};
nbviz.ALL_CATS = "All Categories";
nbviz.TRANS_DURATION = 800;
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
  return d3.schemeCategory10[i];
};

nbviz.nestDataByYear = (entries) => {
  let yearGroups = d3.group(entries, (d) => d.year);
  // this sorts the categories of
  let keyValues = Array.from(yearGroups, ([key, values]) => {
    let year = key;
    let prizes = values;
    prizes = prizes.sort((p1, p2) => (p1.category > p2.category ? 1 : -1));
    return { key: year, values: prizes };
  });
  // console.log(keyValues);
  return keyValues;
};

nbviz.makeFilterAndDimensions = (winnersData) => {
  // ADD OUT FILTER AND CREATE CATEGORY DIMENSIONS
  nbviz.filter = crossfilter(winnersData);

  nbviz.countryDim = nbviz.filter.dimension((o) => o.country);

  nbviz.genderDim = nbviz.filter.dimension((o) => o.gender);

  nbviz.categoryDim = nbviz.filter.dimension((o) => o.category);

  nbviz.dateOfBirth = nbviz.filter.dimension((o) =>
    o.date_of_birth.slice(5, 7)
  );

  // nbviz.genderDim.filter(); // reset gender dimension
  // var countryGroup = nbviz.countryDim.group();
  // countryGroup.all();
};

nbviz.filterByCountries = (entries) => {};

nbviz.filterByCategory = (entries) => {};

nbviz.getCountryData = function () {
  let countryGroups = nbviz.countryDim.group().all();
  // make main data ball
  let data = countryGroups
    .map(function (c) {
      let cData = nbviz.data.countryData[c.key];
      let value = c.value;
      // if per capita value then fivide by pop. size
      if (nbviz.valuePerCapita) {
        value = value /= cData.population;
      }
      try {
        return {
          key: c.key, // e.g. Japan
          value: value, // e.g. 19 (prizes)
          code: cData.alpha3Code, // e.g. JPN
        };
      } catch (error) {
        console.log(error);
      }
    })
    .sort(function (a, b) {
      return b.value - a.value; // descending
    });
  return data;
};

nbviz.getLaureateBirthMonth = function () {
  return nbviz.dateOfBirth.group().all();
};

nbviz.callbacks = [];

nbviz.onDataChange = function () {
  nbviz.callbacks.forEach((cb) => cb());
};

export default nbviz;
