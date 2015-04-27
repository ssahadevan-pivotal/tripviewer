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


$('#trip').on('change', '.business-tag input', function() {
  if($(this).is(':checked')) {
    tagTrip(trip_id, 'business');
  } else {
    untagTrip(trip_id, 'business');
  }
});
