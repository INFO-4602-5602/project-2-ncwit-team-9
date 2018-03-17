//filters
var barChartData = [];
var fullData = [];
var select_gender = "all";
var school_year = "2003-2004";
var sum = 0;
var select_hsgpa = 3.2;
var select_inst = "all";

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
d3.selectAll("input[name='stack']").on("change", function() {
  select_gender = this.value;
  $("#bar").empty();
  dsBarChart(select_gender);
  $("#donut").empty();
  dsDonutChart(school_year, select_gender);
	$("#plot").empty();
	populateBin(select_inst, select_gender, select_hsgpa);

});

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

    // color = d3.scaleOrdinal().range(["#48A36D",  "#56AE7C",  "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]);
    color = d3.scaleOrdinal(d3.schemePastel1); //builtin range of colors

    // color = d3.scaleOrdinal().range(["#07E712","#FF5733","#E72E07","#581845","#24EECD","#0FF09A","#F00FF0","#9D919D","#5141F0","#41A0F0", "#13EF10","#EFB210","#EF8A10","#EF10AB","#0C856A","#34660A","#0A4666","#E2ABB5","#E70964","#967FA9","#9BA97F"]);


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
  .append("svg")
    .attr("width", width)
    .attr("height", height)
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


  var arc = d3.arc() //this will create <path> elements for us using arc data
    .outerRadius(outerRadius).innerRadius(innerRadius);

  // for animation
  var arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
  var arcFinal3 = d3.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

  var pie = d3.pie() //this will create arc data for us given a list of values
    .value(function(d) {
      return d.measure;
    }); //we must tell it out to access the value of each element in our data array

  var arcs = vis.selectAll("g.slice")
    .data(pie(donutChartData))
    .enter()
    .append("svg:g")
    .attr("class", "slice")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
  // .on("click", up)
  ;

  arcs.append("svg:path")
    .attr("fill", function(d, i) {
      return color(i);
    }) //set the color for each slice to be chosen from the color function defined above
    .attr("d", arc) //this creates the actual SVG path using the associated data (pie) with the arc drawing function

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
  height = 650 - margin.top - margin.bottom,
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

//dropdown option
var dropdown_options = [{
    value: "all",
    text: "All"
  },
  {
    value: "487.0",
    text: "487"
  },
  {
    value: "287.0",
    text: "287"
  },
  {
    value: "13.0",
    text: "13"
  },
  {
    value: "194.0",
    text: "194"
  },
  {
    value: "182.0",
    text: "182"
  },
  {
    value: "373.0",
    text: "373"
  },
  {
    value: "319.0",
    text: "319"
  },
  {
    value: "115.0",
    text: "115"
  },
  {
    value: "85.0",
    text: "85"
  },
  {
    value: "157.0",
    text: "157"
  },
  {
    value: "489.0",
    text: "489"
  },
  {
    value: "324.0",
    text: "324"
  },
  {
    value: "361.0",
    text: "361"
  },
  {
    value: "249.0",
    text: "249"
  },
  {
    value: "205.0",
    text: "205"
  }

];

//margins for d3
var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 30
  },
  width = 350 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;


//slider reversing the value
var slider = new Slider("#ex3", {
  reversed: true
});

//dropdown filling
d3.select("#inst_dropdown ")
  .selectAll("option")
  .data(dropdown_options)
  .enter()
  .append("option")
  .attr("value", function(option) {
    return option.value;
  })
  .text(function(option) {
    return option.text;
  });

//slider listner
slider.on("slide", function(sliderValue) {
  select_hsgpa = sliderValue;
  populateBin(select_inst, select_gender, select_hsgpa);
});

//institution change
d3.select("#inst_dropdown ")
  .on("change", function() {
    select_inst = d3.event.target.value;
    populateBin(select_inst, select_gender, select_hsgpa);
  })

	function populateBin(typeInst, typeGender, typehsgpa) {
	  console.log(typeGender);
	  d3.json('bin.json', function(error, data) {

	    // var xscale_ val = ["freshman","sophomore","junior","senior"];
	    var yscale_val = [];
	    var count = 1;
	    var hs_gpa_list = [];
	    var freshman_list = [];

	    var tickLabels = ["", "freshman", "sophomore", "junior", "senior"];

	    d3.select("#partTwo")
	      .data(data.filter(function(d) {
	        if (d.inst == typeInst && d.gender == typeGender && d.hs_gpa == typehsgpa) {

	          yscale_val.push({
	            x: count,
	            y: d.avg,
	            e: d.std
	          });
	          count = count + 1;
	          console.log("Encountered : " + d.gender + d.study + "hs_gpa: " + d.hs_gpa + " " + d.avg)
	          return d;
	        }
	      }));



	    var xScale = d3.scaleLinear()
	      .range([0, width])
	      .domain([0, 4.5, 8]);

	    var yScale = d3.scaleLinear()
	      .range([height, 0])
	      .domain([1.0, 4.0]).nice();

	    var xAxis = d3.axisBottom(xScale).tickFormat(function(d, i) {
	      return tickLabels[i];
	    })
	    yAxis = d3.axisLeft(yScale).ticks(12 * height / width);

	    let line = d3.line()
	      .x(function(d) {
	        return xScale(d.x);
	      })
	      .y(function(d) {
	        return yScale(d.y);
	      });

	    if (d3.select("svg")) {
	      d3.select("svg").remove();
	    }
	    var svg = d3.select("#plot").append("svg")
	      .attr("width", width + margin.left + margin.right)
	      .attr("height", height + margin.top + margin.bottom)
	      .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




	    svg.append("g").append("rect").attr("width", width).attr("height", height).attr("class", "plot-bg");

	    // Add Axis labels
	    svg.append("g").attr("class", "axis axis--x")
	      .attr("transform", "translate(" + 0 + "," + height + ")")
	      .call(xAxis);

	    svg.append("g").attr("class", "axis axis--y").call(yAxis);

	    // Add Error Line
	    svg.append("g").selectAll("line")
	      .data(yscale_val).enter()
	      .append("line")
	      .attr("class", "error-line")
	      .attr("x1", function(d) {
	        return xScale(d.x);
	      })
	      .attr("y1", function(d) {
	        return yScale(d.y + d.e);
	      })
	      .attr("x2", function(d) {
	        return xScale(d.x);
	      })
	      .attr("y2", function(d) {
	        return yScale(d.y - d.e);
	      });

	    // Add Error Top Cap
	    svg.append("g").selectAll("line")
	      .data(yscale_val).enter()
	      .append("line")
	      .attr("class", "error-cap")
	      .attr("x1", function(d) {
	        return xScale(d.x) - 4;
	      })
	      .attr("y1", function(d) {
	        return yScale(d.y + d.e);
	      })
	      .attr("x2", function(d) {
	        return xScale(d.x) + 4;
	      })
	      .attr("y2", function(d) {
	        return yScale(d.y + d.e);
	      });

	    // Add Error Bottom Cap
	    svg.append("g").selectAll("line")
	      .data(yscale_val).enter()
	      .append("line")
	      .attr("class", "error-cap")
	      .attr("x1", function(d) {
	        return xScale(d.x) - 4;
	      })
	      .attr("y1", function(d) {
	        return yScale(d.y - d.e);
	      })
	      .attr("x2", function(d) {
	        return xScale(d.x) + 4;
	      })
	      .attr("y2", function(d) {
	        return yScale(d.y - d.e);
	      });

	    // Add Scatter Points
	    svg.append("g").attr("class", "scatter")
	      .selectAll("circle")
	      .data(yscale_val).enter()
	      .append("circle")
	      .attr("cx", function(d) {
	        return xScale(d.x);
	      })
	      .attr("cy", function(d) {
	        return yScale(d.y);
	      })
	      .attr("r", 4)
	      .on("mouseover", function(d) {
	        return tooltip.html(d.y.toFixed(3) + " &plusmn; " + d.e.toFixed(3))
	          .style("visibility", "visible")
	          .style("top", (event.pageY - 17) + "px").style("left", (event.pageX + 25) + "px");
	      })
	      .on("mouseout", function() {
	        return tooltip.style("visibility", "hidden");
	      });

	    //title
	    svg.append("text")
	      .attr("x", (width / 2))
	      .attr("y", (margin.top / 2))
	      .attr("text-anchor", "middle")
	      .style("font-size", "16px")
	      .text("Inst : " + typeInst + " | Gender: " + typeGender + " | hs_gpa: " + typehsgpa);

	    if(select_gender == "female")
	    {
	      svg.selectAll("circle")
	      .style("fill","#FFB6C1");

	      svg.selectAll(".error-cap")
	      .style('stroke','#D64F63');

	      svg.selectAll(".error-line")
	      .style('stroke','#b30059');
	    }
	    else if(select_gender == "male")
	    {
	      svg.selectAll("circle")
	      .style("fill","#89cff0");

	      svg.selectAll(".error-cap")
	      .style('stroke','#2A7598');

	      svg.selectAll(".error-line")
	      .style('stroke','#00496B');
	    }

	    else if(select_gender == "all")
	    {
	      svg.selectAll("circle")
	      .style("fill","#9FDD9F");


	      svg.selectAll(".error-cap")
	      .style('stroke','#30ae30');

	      svg.selectAll(".error-line")
	      .style('stroke','#037c03');
	    }

	  });


	}

	populateBin("all", "all", "3.5");
