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


function formatTripCount(trip_count) {
  if(trip_count == 1) {
    return trip_count + ' Trip';
  } else {
    return trip_count + ' Trips';
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

    map.fitBounds(polyline.getBounds()).zoomOut();

    polyline.addTo(map);
  } else {
    map.fitBounds([[trip.start_location.lat, trip.start_location.lon], [trip.end_location.lat, trip.end_location.lon]]);
  }

  var aIcon = L.icon({
    iconUrl: '/images/a.png',
    iconSize: [25, 41],
    iconAnchor: [12, 40],
    popupAnchor: [0,-41],
    shadowUrl: 'https://api.tiles.mapbox.com/mapbox.js/v1.6.1/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 40]
  });

  var bIcon = L.icon({
    iconUrl: '/images/b.png',
    iconSize: [25, 41],
    iconAnchor: [12, 40],
    popupAnchor: [0,-41],
    shadowUrl: 'https://api.tiles.mapbox.com/mapbox.js/v1.6.1/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 40]
  });

  L.marker([trip.start_location.lat, trip.start_location.lon], {title: 'Start Location', icon: aIcon})
    .bindPopup(trip.start_location.name + '<br>' + formatTime(trip.start_time, trip.start_time_zone))
    .addTo(map);
  L.marker([trip.end_location.lat, trip.end_location.lon], {title: 'End Location', icon: bIcon})
    .bindPopup(trip.end_location.name + '<br>' + formatTime(trip.end_time, trip.end_time_zone))
    .addTo(map);
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
