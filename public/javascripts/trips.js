var trips,
    viewType = 'tile';

_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var trip_template = _.template('<div class="trip tile"><a href="/trips/{{id}}"><div class="times"><div class="endTime">{{end_time}}</div>' +
  '<div class="duration">{{duration}}</div><div class="startTime">{{start_time}}</div>' +
  '<div class="tripLine"><div></div><div></div></div></div>' +
  '<div class="tripSummary"><div class="endLocation">{{end_location}}</div><div class="tripSummaryBox"><div class="distance">{{distance}}</div>' +
  '<div class="mpg">{{average_mpg}}</div><div class="fuelCost">{{fuel_cost_usd}}</div><div class="hardBrakes {{hard_brakes_class}}">{{hard_brakes}}</div>' +
  '<div class="hardAccels {{hard_accels_class}}">{{hard_accels}}</div><div class="durationOver70 {{speeding_class}}">{{speeding}}</div></div>' +
  '<div class="startLocation">{{start_location}}</div></div></a><div class="map" id="map{{id}}"></div></div>');

var trip_table_template = _.template('<a class="trip table" href="/trips/{{id}}"><div class="select"><input type="checkbox" checked=""></div>' +
  '<div class="startTime">{{start_time}}</div><div class="endTime">{{end_time}}</div><div class="duration">{{duration}}</div>' +
  '<div class="startLocation">{{start_location}}</div><div class="endLocation">{{end_location}}</div>' +
  '<div class="distance">{{distance}}</div><div class="mpg">{{average_mpg}}</div><div class="fuelCost">{{fuel_cost_usd}}</div></a>');

var trip_table_header = _.template('<div class="table table-header"><div class="select"><input id="selectall" type="checkbox" checked=""></div>' +
'<div class="startTime">Start Time</div><div class="endTime">End Time</div><div class="duration">Time</div>' +
'<div class="startLocation">Start Location</div><div class="endLocation">End Location</div><div class="distance">Dist</div>' +
'<div class="mpg">MPG</div><div class="fuelCost">Fuel</div></div>');

fetchTrips(renderViewType);

//postpone drawing maps until we need them
$(window).scroll(drawMaps);


$('#refresh').click(function() {
  clearCache();
  deleteData();
  fetchTrips(renderViewType);
});


$('.display-type a').click(function() {
  viewType = $(this).data('type');
  $(this).addClass('active').siblings().removeClass('active')
  renderViewType();
  return false;
});


$('#selectall').change(function() {
  if($(this).is(':checked')) {
    selectAll();
  } else {
    selectNone();
  }
});


$('#trips').on('change', '.trip.table input[type="checkbox"]', function(){
  if($('.trip.table input[type="checkbox"]').length == $('.trip.table input[type="checkbox"]:checked').length) {
    selectAll();
  } else {
    selectSome();
  }
});


$('#csv, #json').click(function() {
  var href = '/download/trips.' + this.id;
  if(viewType == 'table') {
    var trip_ids = $('.trip.table input[type="checkbox"]:checked').map(function() { return $(this).parents('.trip').data('trip_id'); }).get();
    href += '?trip_ids=' + trip_ids.join(',');
  }
  $(this).attr('href', href);
});


function deleteData() {
  $('#trips').empty();
}


function selectAll() {
  $('#trips .trip input[type="checkbox"]').each(function(idx, checkbox){ $(checkbox).prop('checked', true); })
  $('#selectall').prop('checked', true);
  $('#export span').text('Export All');
}


function selectSome() {
  $('#selectall').prop('checked', false);
  $('#export span').text('Export Selected');
}


function selectNone() {
  $('#selectall').prop('checked', false);
  $('#export span').text('Export Selected');
  $('#trips .trip input[type="checkbox"]').each(function(idx, checkbox){ $(checkbox).prop('checked', false); })
}



function renderViewType() {
  $('#trips')
    .empty()
    .removeClass()
    .addClass(viewType);

  if(viewType == 'tile') {
    trips.forEach(renderTile);
    selectAll();
  } else if(viewType == 'table') {
    $('#trips').append(_.template(trip_table_header()));
    trips.forEach(renderTable);
  }
  drawMaps();
  hideLoading();
}


function renderNewTrips(trips) {
  if(viewType == 'tile') {
    trips.forEach(renderTile);
    selectAll();
  } else if(viewType == 'table') {
    trips.forEach(renderTable);
  }
}


function renderTile(trip) {
  var trip_formatted = {
    id: trip.id,
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
    start_location: formatLocation(trip.start_location.name),
  };

  $(trip_template(trip_formatted))
    .data('trip', trip)
    .appendTo('#trips');
}


function renderTable(trip) {
  var trip_formatted = {
    id: trip.id,
    start_time: formatTimeTable(trip.start_time, trip.start_time_zone),
    end_time: formatTimeTable(trip.end_time, trip.end_time_zone),
    duration: formatDuration(trip.end_time - trip.start_time),
    start_location: formatLocation(trip.start_location.name),
    end_location: formatLocation(trip.end_location.name),
    distance: formatDistance(trip.distance_m),
    average_mpg: formatMPG(trip.average_mpg),
    fuel_cost_usd: '$' + formatFuelCost(trip.fuel_cost_usd)
  }
  $('#trips').append(trip_table_template(trip_formatted));
}
