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
    top: 50,
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

  var donutChartData = chosenDonutData(school_year, genderType);

  var vis = d3.select("#donut")
    .append("svg:svg")
    .data(donutChartData)
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

 $("#legend").empty();
  var legend_svg = d3.select("#legend")
  .append("svg")
    .attr("width", width)
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
      return color(i);
    })
    .attr("class", "legend-box");

    legend.append("text")
      .attr("x", 35)
      .attr("y", function(d, i) {
        return (legendSpace) + i * (legendSpace) + 6;
      })
      .text(function(d,i) {
        console.log(d.race);
        return d.race;
      });


  var arc = d3.arc()
    .outerRadius(outerRadius).innerRadius(innerRadius);

  // for animation
  var arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
  var arcFinal3 = d3.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

  var pie = d3.pie() //this will create arc data for us given a list of values
    .value(function(d) {
      return d.measure;
    });
  var arcs = vis.selectAll("g.slice")
    .data(pie(donutChartData)) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
    .enter()
    .append("svg:g")
    .attr("class", "slice")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  arcs.append("svg:path")
    .attr("fill", function(d, i) {
      return color(i);
    })
    .attr("d", arc)
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
    bottom: 20,
    left: 50
  },
  width1 = 700 - margin.left - margin.right,
  height1 =550 - margin.top - margin.bottom,
  colorBar = d3.schemeCategory20b,
  barPadding = 1;

function dsBarChart(genderType) {
  var firstbarChartData = datasetBarChosen(group, genderType);
  var xScale = d3.scaleLinear()
    .domain([0, firstbarChartData.length])
    .range([0, width1]);
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(firstbarChartData, function(d) {
      return d.measure;
    })])
    .range([height1, 0]);

  //Create SVG element

  var svg = d3.select("#bar")
    .append("svg")
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", 660 + margin.top + margin.bottom);
  var bar_width = width1 / firstbarChartData.length - barPadding;
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
    .attr("width", width1 / firstbarChartData.length - barPadding)
    .attr("y", function(d) {
      return yScale(d.measure);
    })
    .attr("height", function(d) {
      return height1 - yScale(d.measure);
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
    .attr("x", function(d, i) {
      return (i * (width1 / firstbarChartData.length)) + ((width1 / firstbarChartData.length - barPadding) / 2);
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
    .attr("transform", "translate(" + margin.left + "," + (margin.top + height1) + ")")
    .selectAll("text.xAxis")
    .data(firstbarChartData)
    .enter()
    .append("text")
    .text(function(d) {
      return d.category;
    })
    .style("text-anchor", "end")
    .attr("y", function(d, i) {
      return (i * (width1 / firstbarChartData.length)) + ((width1 / firstbarChartData.length - barPadding) / 2);
    })
    .attr("x", 10)
    .attr("transform", "rotate(-90)")
    .attr("font-weight", "bold")
    .call(wrap, 3);

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
