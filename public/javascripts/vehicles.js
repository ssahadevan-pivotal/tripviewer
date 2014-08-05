var vehicles;

_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var vehicle_template = _.template('<div class="vehicle" id="{{id}}"><div class="vehicleDetails"><div class="display_name">{{display_name}}</div>' +
  '<div class="year">{{year}}</div><div class="make">{{make}}</div><div class="model">{{model}}</div></div>' +
  '<div class="color" style="background-color:{{color}};"></div></div>');

var vehicle_stats_template = _.template('<div class="vehicleStats"><div class="distance"><span class="badge">{{distance_mi}}</span>Miles Driven</div>' +
  '<div class="fuel_volume_gal"><span class="badge">{{fuel_volume_gal}}</span>Gallons of Fuel</div>' +
  '<div class="duration"><span class="badge">{{duration}}</span>Minutes Driven</div>' +
  '<div class="fuel_cost_usd"><span class="badge">${{fuel_cost_usd}}</span>Fuel Cost</div>' +
  '<div class="trip_count">{{trip_count}}</div></div>');


fetchVehicles(renderVehicles);


$('#refresh').click(function() {
  clearCache();
  deleteData();
  fetchVehicles(renderVehicles);
});


function deleteData() {
  $('#vehicles').empty();
}


function renderVehicles(results) {
  vehicles = results;
  $('#vehicles').empty();

  vehicles.forEach(renderVehicle);
  fetchTrips(tripsByVehicle);
}


function renderVehicle(vehicle) {
  vehicle.color = vehicle.color || '#999999';

  $(vehicle_template(vehicle))
    .data('vehicle', vehicle)
    .appendTo('#vehicles');
}


function tripsByVehicle(trips) {
  var totals = d3.nest()
    .key(function(d) { return (d.vehicle) ? d.vehicle.id : ''; })
    .rollup(summarizeData)
    .entries(trips);

  totals.forEach(function(vehicle) {
    var stats = {
      distance_mi: formatDistance(vehicle.values.distance_m),
      duration: formatDuration(vehicle.values.duration),
      fuel_cost_usd: formatFuelCost(vehicle.values.fuel_cost_usd),
      fuel_volume_gal: formatFuelVolume(vehicle.values.fuel_volume_gal),
      trip_count: formatTripCount(vehicle.values.trip_count)
    }

    $(vehicle_stats_template(stats))
      .data('stats', stats)
      .appendTo('#' + vehicle.key);
  });
}
