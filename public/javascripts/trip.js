_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var tripTemplate = _.template($('#singleTrip').html());

if(trip_id) {
  fetchTrip(trip_id, renderTrip);
}


function renderTrip(trip) {
  $('#trip').append(tripTemplate(trip));
  drawMap(trip);
}
