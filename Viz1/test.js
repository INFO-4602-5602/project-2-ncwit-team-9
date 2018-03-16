
var donutChartData = [];


	function dsDonutChart(){
		var width = 360;
        var height = 360;
        var radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal(d3.schemeCategory20c);

        var svg = d3.select('#donut')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

        var donutWidth = 75;

        var arc = d3.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius);

        var pie = d3.pie()
          .value(function(d) { return d.measure; })
          .sort(null);

        var path = svg.selectAll('path')
          .data(pie(donutChartData))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d, i) {
            return color(d.data.Race);
          });

        path.on('mouseover', function(d) {
  var total = d3.sum(dataset.map(function(d) {
    return d.value;
  }));
  var percent = Math.round(1000 * d.data.value / total) / 10;
});
}
