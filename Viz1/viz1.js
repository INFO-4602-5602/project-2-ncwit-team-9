var barChartData = [];
var select_gender = "All";

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("visibility", "hidden");

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 350
  },
  width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

	//gender selector
	d3.selectAll("input[name='stack']").on("change", function() {
	  select_gender = this.value;
		$("#bar").empty();
	 dsBarChart(select_gender);
	});

// set initial group value
var group = "All";

function datasetBarChosen(group,gender) {
  var ds = [];

  // console.log(barChartData);
  for (x in barChartData) {
    if (barChartData[x].race == group && barChartData[x].gender == gender) {
      ds.push(barChartData[x]);
    }
  }
  return ds;
}


  var margin = {
      top: 30,
      right: 5,
      bottom: 20,
      left: 50
    },
    width = 1000 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom,
    colorBar = d3.schemeCategory20b,
    barPadding = 1;



function dsBarChart(genderType) {

	var firstbarChartData = datasetBarChosen(group, genderType);


  var xScale = d3.scaleLinear()
    .domain([0, firstbarChartData.length])
    .range([0, width]);

  // Create linear y scale
  // Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
  // get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.
  var yScale = d3.scaleLinear()
    // use the max funtion to derive end point of the domain (max value of the dataset)
    // do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
    .domain([0, d3.max(firstbarChartData, function(d) {
      return d.measure;
    })])
    // As coordinates are always defined from the top left corner, the y position of the bar
    // is the svg height minus the data value. So you basically draw the bar starting from the top.
    // To have the y position calculated by the range function
    .range([height, 0]);

  //Create SVG element

  var svg = d3.select("#bar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var plot = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  plot.selectAll("bar")
    .data(firstbarChartData)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      // console.log(i);
      return xScale(i);
    })
    .attr("width", width / firstbarChartData.length - barPadding)
    .attr("y", function(d) {
      return yScale(d.measure);
    })
    .attr("height", function(d) {
      return height - yScale(d.measure);
    });



  // Add y labels to plot

  plot.selectAll("text")
    .data(firstbarChartData)
    .enter()
    .append("text")
    .text(function(d) {
      return d.measure;
    })
    .attr("text-anchor", "middle")
    // Set x position to the left edge of each bar plus half the bar width
    .attr("x", function(d, i) {
      return (i * (width / firstbarChartData.length)) + ((width / firstbarChartData.length - barPadding) / 2);
    })
    .attr("y", function(d) {
      return yScale(d.measure) + 14;
    })
    .attr("class", "yAxis")
  /* moved to CSS
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "white")
  */
  ;

  // Add x labels to chart

  var xLabels = svg
  	    .append("g")
  	    .attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
  	    ;

  xLabels.selectAll("text.xAxis")
  	  .data(firstbarChartData)
  	  .enter()
  	  .append("text")
  	  .text(function(d) { return d.category;})
  	  .attr("text-anchor", "middle")
  		// Set x position to the left edge of each bar plus half the bar width
  					   .attr("x", function(d, i) {
  					   		return (i * (width / firstbarChartData.length)) + ((width / firstbarChartData.length - barPadding) / 2);
  					   })
  	  .attr("y", 15)
  	  .attr("class", "xAxis")
  	  //.attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
  	  ;

  // Title

  svg.append("text")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", 15)
    .attr("class", "title")
    .attr("text-anchor", "middle")
    .text("Enrollment");

if(genderType == "Female")
{
	svg.selectAll("rect")
	.style("fill","#FFB6C1");
}
else if(genderType == "Male")
{
	svg.selectAll("rect")
	.style("fill","#89cff0");
}

else if(genderType == "All")
{
	svg.selectAll("rect")
	.style("fill","#9FDD9F");
}
}

d3.json('viz1.json', function(error, data) {
  d3.select("#bar")
    .data(data.filter(function(d) {
      // console.log(d);
      // console.log(d.Race);
      barChartData.push({
				gender: d.Gender,
        race: d.Race,
        category: d.SchoolYear,
        measure: d.Enrollment
      });
      // console.log(barChartData);
    }));
dsBarChart(select_gender);

});
