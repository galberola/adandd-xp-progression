var dataset = [{
    "sale": "202",
    "year": "2000"
}, {
    "sale": "215",
    "year": "2001"
}, {
    "sale": "179",
    "year": "2002"
}, {
    "sale": "199",
    "year": "2003"
}, {
    "sale": "134",
    "year": "2005"
}, {
    "sale": "176",
    "year": "2010"
}];

var visualization = d3.select("#visualization");
const WIDTH = 1000;
const HEIGHT = 500;
const MARGINS = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 50
};

var maxValueX = _.max(dataset, data => data.year).year;
var minValueX = _.min(dataset, data => data.year).year;

var maxValueY = _.max(dataset, data => data.sale).sale;
var minValueY = _.min(dataset, data => data.sale).sale;

console.log(`maxValueX: ${maxValueX}`);
console.log(`minValueX: ${minValueX}`);
console.log(`maxValueY: ${maxValueY}`);
console.log(`minValueY: ${minValueY}`);

// d3.scale.linear uses two properties called range and domain
// to create the scale. Range defines the area available to render the graph,
// and Domain defines the maximum and minimum values we have to
// plot in the available space.
xScale = d3.scaleLinear()
  .range([MARGINS.left, WIDTH - MARGINS.right])
  .domain([minValueX, maxValueX]);

yScale = d3.scaleLinear()
  .range([HEIGHT - MARGINS.top, MARGINS.bottom])
  .domain([minValueY, maxValueY]);

// To plot the sample data in our chart, we need to apply the
// xScale and the yScale to the coordinates to transform them
// and to draw a line across the plotting space.
// D3 provides a API method called d3.svg.line() to draw a line.
var lineGen = d3.line()
  .x(function(d) {
    return xScale(d.year);
  })
  .y(function(d) {
    return yScale(d.sale);
  });

// Next, let's create the axes using the scales defined in the above code.
var xAxis = d3.axisBottom()
    .scale(xScale);

var yAxis = d3.axisLeft()
    .scale(yScale);

// Next, append the created X axis to the svg container as shown:
visualization.append("svg:g")
  .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
  .call(xAxis);

// Note about transform:
//
// While appending the X axis to the SVG container, we can use the
// transform property to move the axis downwards. We'll use translate
// transform to move the axis based on coordinates.
// Since we need to move the X axis only downwards,
// we'll provide the transform coordinates for
// the X axis as 0 and the Y axis just above the margin.

visualization.append("svg:g")
  .call(yAxis);

visualization.append('svg:path')
  .attr('d', lineGen(dataset))
  .attr('stroke', 'green')
  .attr('stroke-width', 2)
  .attr('fill', 'none');
