//filters
var select_hsgpa = 3.2;
var select_gender = "all";
var select_inst = "all";

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


var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip1")
  .style("visibility", "hidden");

//margins for d3
var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 30
  },
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;


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

//gender selector
d3.selectAll("input[name='stack']").on("change", function() {
  select_gender = this.value;
  populateBin(select_inst, select_gender, select_hsgpa);
});

//institution change
d3.select("#inst_dropdown ")
  .on("change", function() {
    select_inst = d3.event.target.value;
    populateBin(select_inst, select_gender, select_hsgpa);
  })


//css : baby blue : #89cff0  baby pink : #FFB6C1
// green base : #9FDD9F

//viz 2 : error plot bar
/*
input: filters for the data
*/
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

    if (d3.select("#svgviz2")) {
      d3.select("#svgviz2").remove();
    }
    var svg = d3.select("#plot").append("svg")
      .attr("id", "svgviz2")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")





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
