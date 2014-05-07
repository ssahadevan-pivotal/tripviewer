var data,
    weekly;

getSummary();


$('.graph-buttons button').click(function() {
  var type = $(this).data('graph-type');
  $(this).addClass('active').siblings().removeClass('active');
  drawGraph(prepData(type));
});

function getSummary() {
  $.getJSON('/download/trips.json')
    .done(function(results) {
      data = results;
      processResults();
      hideLoading();
    });
}


function getEmpty() {
  return {distance_m: 0, duration: 0, trip_count: 0, fuel_volume_gal: 0, fuel_cost_usd: 0};
}


function summarizeData(d) {
  return {
    distance_m: d3.sum(d, function(d) { return +d.distance_m; }),
    duration: d3.sum(d, function(d) { return +(d.end_time - d.start_time); }),
    trip_count: d.length,
    fuel_volume_gal: d3.sum(d, function(d) { return +d.fuel_volume_gal; }),
    fuel_cost_usd: d3.sum(d, function(d) { return +d.fuel_cost_usd; })
  };
}


function processResults() {
  weekly = d3.nest()
    .key(function(d) { return moment(d.start_time).format('YYYY w'); })
    .rollup(summarizeData)
    .entries(data);

  weekly = weekly.reverse();

  var totals = d3.nest()
    .rollup(summarizeData)
    .entries(data);

  showOverview(totals);
  drawGraph(prepData('distance'));
}


function showOverview(totals) {
  $('#overall .distance span').html(formatDistance(totals.distance_m));
  $('#overall .duration span').html(formatDuration(totals.duration));
  $('#overall .trip_count span').html(totals.trip_count);
  $('#overall .fuel_volume_gal span').html(formatFuelVolume(totals.fuel_volume_gal));
  $('#overall .fuel_cost_usd span').html(formatFuelCost(totals.fuel_cost_usd));
}


function prepData(type) {
  var graphData = {},
      formatter;
  if (type == 'distance') {
    formatter = function(d) {
      return parseFloat(formatDistance(d.values.distance_m));
    };
    graphData.yAxisLabel = 'Distance (mi)';
  } else if (type == 'duration') {
    formatter = function(d) {
      return formatDurationHours(d.values.duration);
    };
    graphData.yAxisLabel = 'Drive Time (hours)';
  } else if (type == 'trip_count') {
    formatter = function(d) {
      return d.values.trip_count;
    };
    graphData.yAxisLabel = 'Trip Count';
  } else if (type == 'fuel_cost_usd') {
    formatter = function(d) {
      return d.values.fuel_cost_usd;
    };
    graphData.yAxisLabel = 'Fuel Cost (USD)';
  } else if (type == 'fuel_volume_gal') {
    formatter = function(d) {
      return d.values.fuel_volume_gal;
    };
    graphData.yAxisLabel = 'Fuel Volume (gal)';
  }

  graphData.data = weekly.map(function(d) {
    return {
      value: formatter(d),
      key: moment(d.key, 'YYYY w').toDate()
    }
  });

  return graphData;
}


function drawGraph(graphData) {
  $('#graphs .graph').empty();

  console.log(graphData)

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 600 - margin.left - margin.right,
      height = 222 - margin.top - margin.bottom,
      bisectDate = d3.bisector(function(d) { return d.value; }).left;

  var x = d3.time.scale()
      .domain([_.first(graphData.data).key, _.last(graphData.data).key])
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, d3.max(_.pluck(graphData.data, 'value'))]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(6);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      //.interpolate("cardinal")
      .x(function(d) { return x(d.key); })
      .y(function(d) { return y(d.value); });

  var svg = d3.select("#graphs .graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-3.2em")
      .style("text-anchor", "end")
      .text(graphData.yAxisLabel);

  svg.append("path")
      .datum(graphData.data)
      .attr("class", "line")
      .attr("d", line);
}
