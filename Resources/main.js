function randomPoints(n) {
  let d = [];

  for (let i = 1; i < n + 1; i++) {
    d.push({
      x: i,
      y: i + d3.randomUniform(6)(),
      e: d3.randomUniform(1, 3)()
    })
  }

  return d;
}

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("visibility", "hidden");

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

function populateBin(typeInst,typeGender,typehsgpa) {
  d3.json('../data.json', function(error, data) {

    // var xscale_ val = ["freshman","sophomore","junior","senior"];
    var yscale_val = [];
    var count = 1;
    var hs_gpa_list = [];
    var freshman_list = [];

		var tickLabels = ["", "freshman","sophomore","junior","senior"];

    console.log(data);

    d3.select("#partTwo")
      .append("p")
      .data(data.filter(function(d) {
        if (d.inst == typeInst && d.gender == typeGender && d.hs_gpa == typehsgpa) {
          // hs_gpa_list.push(d.hs_gpa);
          // freshman_list.push(d.avg);
          yscale_val.push({
            x: count,
            y: d.avg,
            e: d.std
          });
          count = count + 1;
          console.log("Encountered : " + d.gender + d.study + "hs_gpa: " + d.hs_gpa + " " + d.avg)
          return d;
        }
      }))
      .enter()
      .append("div")
      .text(function(d) {
        return "Encountered : " + d.gender + d.study + "hs_gpa: " + d.hs_gpa + " : " + d.avg;
      });



    var xScale = d3.scaleLinear()
      .range([0, width])
      .domain([0, 4, 8]);

    var yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 4.0]).nice();

    var xAxis = d3.axisBottom(xScale).tickFormat(function(d,i){
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
				.text("Inst : "+ typeInst +"| Gender: " + typeGender + "| hs_gpa: " + typehsgpa );

  });


}

populateBin("all","all","3.2");
