function showLoading() {
  $('.loading').fadeIn();
}


function hideLoading() {
  $('.loading').fadeOut('fast');
}


function showAlert(msg, type) {
  var type = type || 'info';
  $('#alert').html(msg).removeClass().addClass('alert alert-' + type).fadeIn();
}


function hideAlert() {
  $('#alert').fadeOut();
}


function formatDuration(ms) {
  var mins = Math.floor(ms % (60 * 60 * 1000) / (60 * 1000));
  var hours = Math.floor(ms / (60 * 60 * 1000));
  return ((hours > 0) ? hours + 'h ' : '') + mins + ' min'
}


function formatDurationHours(ms) {
  return Math.round(ms / (60 * 60 * 1000) * 100) / 100;
}


function formatDistance(distance) {
  //convert from m to mi
  var distance_mi = distance / 1609.34;
  if(Math.round(distance_mi) >= 100) {
    return distance_mi.toFixed(0);
  } else {
    return distance_mi.toFixed(1);
  }
}


function formatFuelCost(fuelCost) {
  return fuelCost.toFixed(2);
}


function formatFuelVolume(fuelVolume) {
  return fuelVolume.toFixed(1);
}


function formatLocation(location) {
  return (location) ? location.replace(/\d+, USA/gi, '') : '';
}


function formatMPG(average_mpg) {
  return average_mpg.toFixed(1);
}


function formatSpeeding(sec) {
  return Math.floor(sec / 60);
}


function formatTime(time, timezone) {
  try {
    return moment(time).tz(timezone).format('MMM D, YYYY<br> h:mm A');
  } catch(e) {
    return moment(time).format('MMM D, YYYY<br> h:mm A');
  }
}

function formatDate(time, timezone) {
  try {
    return moment(time).tz(timezone).format('MMM D, YYYY');
  } catch(e) {
    return moment(time).format('MMM D, YYYY');
  }
}



function formatTimeTable(time, timezone) {
  try {
    return moment(time).tz(timezone).format('YYYY-MM-DD h:mm A');
  } catch(e) {
    return moment(time).format('YYYY-MM-DD h:mm A');
  }
}


function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemTop <= docViewBottom) && (elemBottom >= docViewTop));
}


function drawMaps() {
  $('.map').not('.leaflet-container').each(function(idx, map) {
    if(isScrolledIntoView(map)) {
      var trip = $(map).parents('.trip').data('trip');
      drawMap(trip);
    }
  });
}


function drawMap(trip) {
  var div_id = 'map' + trip.id;
  var map = L.mapbox.map(div_id, 'examples.map-9ijuk24y');

  if (trip.path) {
    var polyline = L.Polyline.fromEncoded(trip.path, {color: '#08b1d5', opacity: 0.9});

    map.fitBounds(polyline.getBounds());

    polyline.addTo(map);
  } else {
    map.fitBounds([[trip.start_location.lat, trip.start_location.lon], [trip.end_location.lat, trip.end_location.lon]]);
  }

  L.marker([trip.start_location.lat, trip.start_location.lon], {clickable: false, title: 'Start Location'}).addTo(map);
  L.marker([trip.end_location.lat, trip.end_location.lon]).addTo(map);
}
