var barChartData = [];
var donutChartData = [];
var select_gender = "All";

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("visibility", "hidden");
var 	formatAsPercentage = d3.format("%");
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

	function dsDonutChart(){
		var 	width = 400,
			   height = 400,
			   outerRadius = Math.min(width, height) / 2,
			   innerRadius = outerRadius * .999,
			   // for animation
			   innerRadiusFinal = outerRadius * .5,
			   innerRadiusFinal3 = outerRadius* .45,
			   color = d3.scaleOrdinal(d3.schemeCategory20b);   //builtin range of colors


		var vis = d3.select("#donut")
		     .append("svg:svg")              //create the SVG element inside the <body>
		     .data(donutChartData)                   //associate our data with the document
		         .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
		         .attr("height", height)
						 .append("svg:g")                //make a group to hold our pie chart
 	         .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")    //move the center of the pie chart from 0, 0 to radius, radius
 				;

    var arc = d3.arc()              //this will create <path> elements for us using arc data
         	.outerRadius(outerRadius).innerRadius(innerRadius);

    // for animation
    var arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
 	var arcFinal3 = d3.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

    var pie = d3.pie()           //this will create arc data for us given a list of values
         .value(function(d) { return d.measure; });    //we must tell it out to access the value of each element in our data array

    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
         .data(pie(donutChartData))                        //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
         .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
             .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice")    //allow us to style things in the slices (like text)
                .on("mouseover", mouseover)
     				.on("mouseout", mouseout)
     				// .on("click", up)
     				;

         arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
 					.append("svg:title") //mouseover title showing the figures
 				   .text(function(d) { return d.data.race + ": " + formatAsPercentage(d.data.measure); });

         d3.selectAll("g.slice").selectAll("path").transition()
 			    .duration(750)
 			    .delay(10)
 			    .attr("d", arcFinal )
 			    ;

 	  // Add a label to the larger arcs, translated to the arc centroid and rotated.
 	  // source: http://bl.ocks.org/1305337#index.html
 	  arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
 	  		.append("svg:text")
 	      .attr("dy", ".35em")
 	      .attr("text-anchor", "middle")
 	      .attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
 	      //.text(function(d) { return formatAsPercentage(d.value); })
 	      .text(function(d) { return d.data.race; })
 	      ;

 	   // Computes the label angle of an arc, converting from radians to degrees.
 		function angle(d) {
 		    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
 		    return a > 90 ? a - 180 : a;
 		}


 		// Pie chart title
 		vis.append("svg:text")
 	     	.attr("dy", ".35em")
 	      .attr("text-anchor", "middle")
 	      .text("Demographic Enrollment")
 	      .attr("class","title")
 	      ;

		function mouseover() {
		  d3.select(this).select("path").transition()
		      .duration(750)
		        		//.attr("stroke","red")
		        		//.attr("stroke-width", 1.5)
		        		.attr("d", arcFinal3)
		        		;
		}

		function mouseout() {
		  d3.select(this).select("path").transition()
		      .duration(750)
		        		//.attr("stroke","blue")
		        		//.attr("stroke-width", 1.5)
		        		.attr("d", arcFinal)
		        		;
		}
	}


d3.json('viz1.json', function(error, data) {
		d3.select("#donut")
		.data(data.filter(function(d) {
			// console.log(d);
			// console.log(d.Race);
			donutChartData.push({
				gender: d.Gender,
				race: d.Race,
				category: d.SchoolYear,
				measure: d.Enrollment
			});
			// console.log(donutChartData);
		}));
		dsDonutChart();
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
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "black");
  ;

  // Add x labels to chart

  var xLabels = svg
  	    .append("g")
				.attr("class", "x axis")
  	    .attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
  	    .selectAll("text.xAxis")
  	  .data(firstbarChartData)
  	  .enter()
  	  .append("text")
  	  .text(function(d) { return d.category;})
  	  .style("text-anchor", "end")
  		// Set x position to the left edge of each bar plus half the bar width
  					   .attr("x", function(d, i) {
  					   		return (i * (width / firstbarChartData.length)) + ((width / firstbarChartData.length - barPadding) / 2);
  					   })
  	  .attr("y", 15)
  	  .attr("transform","rotate(0)");

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
  function compare(a,b)
    {
      if(a.SchoolYear > b.SchoolYear)
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
