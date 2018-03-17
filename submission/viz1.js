var barChartData = [];
var fullData = [];
var select_gender = "all";
var school_year = "2003-2004";
var sum = 0;

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip1")
  .style("visibility", "hidden");

var formatAsPercentage = d3.format(".2%");
var margin = {
    top: 20,
    right: 20,
    bottom: 0,
    left: 350
  },
  width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  radius = Math.min(width, height) / 2;;

//gender selector





function psuedofunction1(value)
{
  console.log("change");
  select_gender = value;
  $("#bar").empty();
  dsBarChart(select_gender);
  $("#donut").empty();
  dsDonutChart(school_year, select_gender);

}


// d3.selectAll("input[name='stack']").on("change", function() {
//   select_gender = this.value;
//   populateBin(select_inst, select_gender, select_hsgpa);
// });

function chosenDonutData(group, gender) {
  var ds = [];
  sum = 0;
  // console.log(barChartData);
  for (x in fullData) {
    if (fullData[x].category == group && fullData[x].gender == gender && fullData[x].race != "all") {

      sum = sum + fullData[x].measure;
      ds.push(fullData[x]);
    }
  }
  for (x in ds) {
    ds[x].measure = ds[x].measure / sum;
    // console.log(sum);
    // console.log(ds[x].measure);
  }
  return ds;
}

function dsDonutChart(school_year, genderType) {
  var width = 400,
    height = 400,
    outerRadius = Math.min(width, height) / 2,
    innerRadius = outerRadius * .999,
    // for animation
    innerRadiusFinal = outerRadius * .5,
    innerRadiusFinal3 = outerRadius * .45,
    // color = d3.scaleOrdinal().range(["#07E712","#FF5733","#E72E07","#581845","#24EECD","#0FF09A","#F00FF0","#9D919D","#5141F0","#41A0F0", "#13EF10","#EFB210","#EF8A10","#EF10AB","#0C856A","#34660A","#0A4666","#E2ABB5","#E70964","#967FA9","#9BA97F"]);
    color = d3.scaleOrdinal(d3.schemePastel1); //builtin range of colors
  // color = d3.scaleSequential(d3.interpolateInferno).domain([0, width]);

  var donutChartData = chosenDonutData(school_year, genderType);





  var vis = d3.select("#donut")
    .append("svg:svg") //create the SVG element inside the <body>
    .data(donutChartData) //associate our data with the document
    .attr("width", width) //set the width and height of our visualization (these will be attributes of the <svg> tag
    .attr("height", height)
    .append("svg:g") //make a group to hold our pie chart
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")") //move the center of the pie chart from 0, 0 to radius, radius
  ;

 $("#legend").empty();
  var legend_svg = d3.select("#legend")
  .append("svg") //create the SVG element inside the <body>
  //associate our data with the document
    .attr("width", width) //set the width and height of our visualization (these will be attributes of the <svg> tag
    .attr("height", 250)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var legend = legend_svg.selectAll(".races")
    .data(donutChartData)
    .enter().append("g")
    .attr("class", "race");

  var legendSpace = 200 / 8;

  legend.append("rect")

    .attr("width", 20)
    .attr("height", 20)
    .attr("x", 10)
    .attr("y", function(d, i) {
      return (legendSpace) + i * (legendSpace) - 8;
    })
    .attr("fill", function(d,i) {
      select_color = color(d.race);
      console.log(select_color);
      return color(i); // If array key "visible" = true then color rect, if not then make it grey
    })
    .attr("class", "legend-box");

    legend.append("text")
      .attr("x", 35)
      .attr("y", function(d, i) {
        return (legendSpace) + i * (legendSpace) + 6;
      }) // (return (11.25/2 =) 5.625) + i * (5.625)
      .text(function(d,i) {
        console.log(d.race);
        return d.race;
      });


  var arc = d3.arc() //this will create <path> elements for us using arc data
    .outerRadius(outerRadius).innerRadius(innerRadius);

  // for animation
  var arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
  var arcFinal3 = d3.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

  var pie = d3.pie() //this will create arc data for us given a list of values
    .value(function(d) {
      return d.measure;
    }); //we must tell it out to access the value of each element in our data array

  var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
    .data(pie(donutChartData)) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
    .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
    .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
    .attr("class", "slice") //allow us to style things in the slices (like text)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
  // .on("click", up)
  ;

  arcs.append("svg:path")
    .attr("fill", function(d, i) {
      return color(i);
    }) //set the color for each slice to be chosen from the color function defined above
    .attr("d", arc) //this creates the actual SVG path using the associated data (pie) with the arc drawing function
    // .append("svg:title") //mouseover title showing the figures
    //  .text(function(d) {return d.data.race + ": " + d.data.measure;})
    .on("mouseover", function(d) {
      return tooltip.html(d.data.race + " : " + formatAsPercentage((d.data.measure).toFixed(3)))
        .style("visibility", "visible")
        .style("top", (event.pageY - 17) + "px").style("left", (event.pageX + 25) + "px");
    })
    .on("mouseout", function() {
      return tooltip.style("visibility", "hidden");
    })

  d3.selectAll("g.slice").selectAll("path").transition()
    .duration(750)
    .delay(10)
    .attr("d", arcFinal)
    .attr("data-legend", function(d) {
      return d.race
    });

  // Add a label to the larger arcs, translated to the arc centroid and rotated.
  // source: http://bl.ocks.org/1305337#index.html
  arcs.filter(function(d) {
      return d.endAngle - d.startAngle > .2;
    })
    .append("svg:text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
    });

  // Computes the label angle of an arc, converting from radians to degrees.
  function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }

  // Pie chart title
  vis.append("svg:text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .style("font-size", "16px")
    .text("Demographic Enrollment")
    .attr("class", "title");

  vis.append("svg:text")
    .attr("dy", "1.75em")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .style("font-size", "16px")
    .text(school_year)
    .attr("class", "title");

  function mouseover() {
    d3.select(this).select("path").transition()
      .duration(400)
      .attr("d", arcFinal3);
  }

  function mouseout() {
    d3.select(this).select("path").transition()
      .duration(400)
      .attr("d", arcFinal);
  }



}


d3.json('viz1.json', function(error, data) {
  d3.select("#donut")
    .data(data.filter(function(d) {
      // console.log(d);
      // console.log(d.Race);
      fullData.push({
        gender: d.Gender,
        race: d.Race,
        category: d.SchoolYear,
        measure: d.Enrollment
      });
      // console.log(donutChartData);
    }));
  dsDonutChart(school_year, select_gender);
});

// set initial group value
var group = "all";

function datasetBarChosen(group, gender) {
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
    bottom: 90,
    left: 50
  },
  width = 700 - margin.left - margin.right,
  height = 850 - margin.top - margin.bottom,
  colorBar = d3.schemeCategory20b,
  barPadding = 1;



function dsBarChart(genderType) {


  var firstbarChartData = datasetBarChosen(group, genderType);


  var xScale = d3.scaleLinear()
    .domain([0, firstbarChartData.length])
    .range([0, width]);
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(firstbarChartData, function(d) {
      return d.measure;
    })])
    .range([height, 0]);

  //Create SVG element

  var svg = d3.select("#bar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  var bar_width = width / firstbarChartData.length - barPadding;
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
    })
    .on("click", update);

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
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "black")
    .attr("font-weight", "bold");

  function update(d) {
    $("#donut").empty();
    school_year = d.category
    dsDonutChart(school_year, genderType);
  }

  function wrap(text, width) {
    text.each(function() {

      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = 0.01,
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

  // Add x labels to chart

  var xLabels = svg
    .append("g")
    .attr("class", "x axis")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")")
    .selectAll("text.xAxis")
    .data(firstbarChartData)
    .enter()
    .append("text")
    // .attr("")
    .text(function(d) {
      return d.category;
    })
    .style("text-anchor", "end")
    // Set x position to the left edge of each bar plus half the bar width
    .attr("y", function(d, i) {
      return (i * (width / firstbarChartData.length)) + ((width / firstbarChartData.length - barPadding) / 2);
    })
    .attr("x", 10)
    .attr("transform", "rotate(-90)")
    .attr("font-weight", "bold")
    .call(wrap, 3);

  //
  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis)
  //   .selectAll("text")
  //     .attr("y", 0)
  //     .attr("x", 9)
  //     .attr("dy", ".35em")
  //     .attr("transform", "rotate(90)")
  //     .style("text-anchor", "start");

  // Title
  svg.append("text")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", 15)
    .attr("class", "title")
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .attr("font-weight", "bold")
    .text("Enrollment details for  " + genderType + " students.");

  if (genderType == "female") {
    svg.selectAll("rect")
      .style("fill", "#FFB6C1");
  } else if (genderType == "male") {
    svg.selectAll("rect")
      .style("fill", "#89cff0");
  } else if (genderType == "all") {
    svg.selectAll("rect")
      .style("fill", "#9FDD9F");
  }
}

d3.json('viz1.json', function(error, data) {
  function compare(a, b) {
    if (a.SchoolYear > b.SchoolYear)
      return 1;
    else {
      return -1;
    }
  }
  data.sort(compare);
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
