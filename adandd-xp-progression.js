drawLinearGraph('.grap-lvl-6', 6);
drawLinearGraph('.grap-lvl-12', 12);
drawLinearGraph('.grap-lvl-20', 20);

function drawLinearGraph(element, maxLevel) {
  // set the dimensions and margins of the graph
  var MARGIN = { top: 20, right: 20, bottom: 30, left: 70};
  var WIDTH = 960 - MARGIN.left - MARGIN.right;
  var HEIGHT = 500 - MARGIN.top - MARGIN.bottom;
  var COLOR_SCHEMA = ['#e82525', '#e8d425', '#7ce825', '#3225e8', '#c725e8', '#000000', '#685904'];

  var csvsRequested = 0;
  var csvsLoaded = 0;
  var csvData = {};
  var MAX_LEVEL = maxLevel || 20;

  // set the ranges
  var x = d3.scaleLinear().range([0, WIDTH]);
  var y = d3.scaleLinear().range([HEIGHT, 0]);

  // define the line
  var valueline = d3.line()
    .x(function(d) { return x(d.lvl); })
    .y(function(d) { return y(d.xp); });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(element)
    .append("svg")
      .attr("width", WIDTH + MARGIN.left + MARGIN.right)
      .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
    .append("g")
      .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

  loadCsvs([{
    keyName: 'fighter',
    location: 'data/fighter.csv',
    color: COLOR_SCHEMA[0]
  }, {
    keyName: 'paladin-ranger',
    location: 'data/paladin-ranger.csv',
    color: COLOR_SCHEMA[1]
  }, {
    keyName: 'wizard',
    location: 'data/wizard.csv',
    color: COLOR_SCHEMA[2]
  }, {
    keyName: 'cleric',
    location: 'data/cleric.csv',
    color: COLOR_SCHEMA[3]
  }, {
    keyName: 'druid',
    location: 'data/druid.csv',
    color: COLOR_SCHEMA[4]
  }, {
    keyName: 'rogue-bard',
    location: 'data/rogue-bard.csv',
    color: COLOR_SCHEMA[5]
  }]);


  function loadCsvs(csvs) {
    csvsRequested = csvs.length;

    csvs.forEach(function (csv) {
      d3.csv(csv.location, function (error, data) {
        handleLoadCsv(error, data, csv.keyName, csv.color);
      });
    });
  }

  function handleLoadCsv(error, data, keyName, color) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
      d.xp = parseInt(d.xp);
      d.lvl = parseInt(d.lvl);
    });

    data = data.filter(function (d) {
      return d.lvl <= MAX_LEVEL;
    });

    csvData[keyName] = {
      color: color,
      data: data
    };

    csvsLoaded += 1;

    onCsvsLoaded();
  }

  function onCsvsLoaded() {
    // Only proceed if all CSVs have been loaded
    if (csvsLoaded < csvsRequested) return;

    var xMax = getMaxXpRange();

    // Scale ranges
    x.domain([1, MAX_LEVEL]); // Level 1 to 20
    y.domain([0, xMax]); // XP Max - Mage: 3.750.000

    drawGraph();
  }

  function getMaxXpRange() {
    var maxes = [];

    for (var key in csvData) {
      maxes.push(_.max(csvData[key].data, function (data) { return data.xp; }));
    }

    return _.max(maxes, function (data) { return data.xp; }).xp;
  }

  function drawGraph() {
    for (var key in csvData) {
      // Add the valueline path.
      svg.append("path")
        .data([csvData[key].data])
        .attr("fill", "none")
        .attr("stroke", csvData[key].color)
        .attr("stroke-width", "2px")
        .attr("class", "line")
        .attr("d", valueline);

      $(element).append($(`<p style="color:${csvData[key].color}">${key}</p>`));
    }

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + HEIGHT + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));
  }
}
