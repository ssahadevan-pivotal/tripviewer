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


function formatDuration(s) {
  var duration = moment.duration(s, 'seconds'),
      hours = (duration.asHours() >= 1) ? Math.floor(duration.asHours()) + ' h ' : '',
      minutes = duration.minutes() + ' min';
  return hours + minutes;
}


function formatDurationMinutes(s) {
  return moment.duration(s, 'seconds').asMinutes().toFixed();
}


function formatDurationHours(s) {
  return moment.duration(s, 'seconds').asHours().toFixed();
}


function m_to_mi(distance_m) {
  return distance_m / 1609.34;
}


function l_to_usgal(volume_l) {
  return volume_l * 0.264172;
}


function kmpl_to_mpg(kmpl) {
  return kmpl * 2.35214583;
}


function formatDistance(distance) {
  if(Math.round(distance) >= 100) {
    return distance.toFixed(0);
  } else {
    return (distance || 0).toFixed(1);
  }
}


function formatFuelCost(fuelCost) {
  return (fuelCost || 0).toFixed(2);
}


function formatFuelVolume(fuelVolume) {
  return (fuelVolume || 0).toFixed(1);
}


function formatMPG(kmpl) {
  var mpg = kmpl_to_mpg(kmpl);
  return (mpg) ? mpg.toFixed(1) : '';
}


function formatAddress(address) {
  return (address && address.name) ? address.name.replace(/\d+, USA/gi, '') : '';
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
    return (trip_count || 0) + ' Trips';
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
  var map = L.mapbox.map(div_id, 'examples.map-i86nkdio');

  if (trip.path) {
    var polyline = L.Polyline.fromEncoded(trip.path, {color: '#08b1d5', opacity: 0.9});

    map.fitBounds(polyline.getBounds()).zoomOut();

    polyline.addTo(map);
  } else {
    map.fitBounds([[trip.start_location.lat, trip.start_location.lon], [trip.end_location.lat, trip.end_location.lon]]);
  }

  var aIcon = L.icon({
    iconUrl: '/images/marker-a.png',
    iconSize: [25, 41],
    iconAnchor: [12, 40],
    popupAnchor: [0,-41],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 40]
  });

  var bIcon = L.icon({
    iconUrl: '/images/marker-b.png',
    iconSize: [25, 41],
    iconAnchor: [12, 40],
    popupAnchor: [0,-41],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 40]
  });

  L.marker([trip.start_location.lat, trip.start_location.lon], {title: 'Start Location', icon: aIcon})
    .bindPopup(trip.start_address + '<br>' + formatTime(trip.started_at, trip.start_timezone))
    .addTo(map);
  L.marker([trip.end_location.lat, trip.end_location.lon], {title: 'End Location', icon: bIcon})
    .bindPopup(trip.end_address + '<br>' + formatTime(trip.ended_at, trip.end_timezone))
    .addTo(map);
}


function summarizeData(d) {
  var summary = {
    distance_m: d3.sum(d, function(d) { return +d.distance_m; }),
    duration_s: d3.sum(d, function(d) { return +d.duration_s; }),
    trip_count: d.length,
    fuel_volume_usgal: d3.sum(d, function(d) { return +d.fuel_volume_usgal; }),
    fuel_cost_usd: d3.sum(d, function(d) { return +d.fuel_cost_usd; })
  };
  summary.average_mpg = m_to_mi(summary.distance_m) / summary.fuel_volume_usgal;

  return summary;
}
