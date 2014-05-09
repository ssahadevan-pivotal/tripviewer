_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var trip_template = _.template('<h2>{{title}}</h2><div class="map" id="map{{id}}"></div><div class="trip tile">' +
    '<div class="times"><div class="endTime">{{end_time}}</div>' +
    '<div class="duration">{{duration}}</div><div class="startTime">{{start_time}}</div>' +
    '<div class="tripLine"><div></div><div></div></div></div>' +
    '<div class="tripSummary"><div class="endLocation">{{end_location}}</div><div class="tripSummaryBox">' +
    '<div class="distance">{{distance}}</div><div class="hardBrakes {{hard_brakes_class}}">{{hard_brakes}}</div>' +
    '<div class="mpg">{{average_mpg}}</div><div class="hardAccels {{hard_accels_class}}">{{hard_accels}}</div>' +
    '<div class="fuelCost">{{fuel_cost_usd}}</div><div class="durationOver70 {{speeding_class}}">{{speeding}}</div></div>' +
    '<div class="startLocation">{{start_location}}</div></div><a class="btn btn-primary btn-share"><i class="glyphicon glyphicon-share"></i> Share This Trip</a></div></div>');

if(trip_id) {
  fetchTrip(trip_id, renderTrip);
}


function renderTrip(trip) {
  var trip_formatted = {
    id: trip.id,
    title: 'Drive to ' + formatLocation(trip.end_location.name) + ' on ' + formatDate(trip.start_time, trip.start_time_zone),
    end_time: formatTime(trip.end_time, trip.end_time_zone),
    duration: formatDuration(trip.end_time - trip.start_time),
    start_time: formatTime(trip.start_time, trip.start_time_zone),
    end_location: formatLocation(trip.end_location.name),
    distance: formatDistance(trip.distance_m),
    average_mpg: formatMPG(trip.average_mpg),
    fuel_cost_usd: formatFuelCost(trip.fuel_cost_usd),
    hard_brakes_class: (trip.hard_brakes > 0 ? 'someHardBrakes' : 'noHardBrakes'),
    hard_brakes: trip.hard_brakes || '<i class="glyphicon glyphicon-ok"></i>',
    hard_accels_class: (trip.hard_accels > 0 ? 'someHardAccels' : 'noHardAccels'),
    hard_accels: trip.hard_accels || '<i class="glyphicon glyphicon-ok"></i>',
    speeding_class: (formatSpeeding(trip.duration_over_70_s) > 0 ? 'someSpeeding' : 'noSpeeding'),
    speeding: Math.ceil(trip.duration_over_70_s/60) || '<i class="glyphicon glyphicon-ok"></i>',
    start_location: formatLocation(trip.start_location.name)
  };

  $('#trip').append(trip_template(trip_formatted));
  drawMap(trip);
}
