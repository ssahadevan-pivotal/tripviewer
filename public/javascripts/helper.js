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


function formatSpeeding(s) {
  if(!s || s < 30) {
    return '<i class="glyphicon glyphicon-ok"></i>';
  } else if((s / 60) > 60) {
    return moment.duration(s, 'seconds').asHours().toFixed(1);
  } else {
    return formatDurationMinutes(s);
  }
}


function getSpeedingClass(s) {
  if(!s || s < 30) {
    return 'noSpeeding';
  } else if((s / 60) > 60) {
    return 'someSpeedingHours';
  } else {
    return 'someSpeedingMinutes';
  }
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


function cleanAddress(address) {
  if(!address) {
    address = {};
  }

  address.cleaned = (address && address.name) ? address.name.replace(/\d+, USA/gi, '') : '';
  address.multiline = formatAddressMultiline(address.cleaned);

  return address;
}


function formatAddressMultiline(cleaned) {
  var lines = cleaned.split(', ');

  if(lines.length > 2) {
    var first = lines.shift();
    cleaned = first + '<br>' + lines.join(', ');
  }
  return cleaned;
}


function formatDate(time, timezone) {
  try {
    return moment(time).tz(timezone).format('MMM D, YYYY');
  } catch(e) {
    return moment(time).format('MMM D, YYYY');
  }
}


function formatTime(time, timezone) {
  try {
    return moment(time).tz(timezone).format('h:mm A');
  } catch(e) {
    return moment(time).format('h:mm A');
  }
}


function formatDayOfWeek(time, timezone) {
  try {
    return moment(time).tz(timezone).format('dddd');
  } catch(e) {
    return moment(time).format('dddd');
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
  // Setup mapbox
  L.mapbox.accessToken = mapboxAccessToken;

  var styleId = 'automatic.h5kpm228',
      mapId = 'map' + trip.id,
      map = L.mapbox.map(mapId, styleId),
      start = [trip.start_location.lat, trip.start_location.lon],
      end = [trip.end_location.lat, trip.end_location.lon],
      lineStyle = {color: '#08b1d5', opacity: 0.9},
      iconStyle = {
        iconSize: [25, 41],
        iconAnchor: [12, 40],
        popupAnchor: [0,-41],
        shadowUrl: '/images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 40]
      },
      aIcon = L.icon(_.extend(iconStyle, {iconUrl: '/images/marker-a.png'})),
      bIcon = L.icon(_.extend(iconStyle, {iconUrl: '/images/marker-b.png'})),
      startPopupContent = trip.start_address.multiline + '<br>' + trip.started_at_date + '<br>' + trip.started_at_time,
      endPopupContent = trip.end_address.multiline + '<br>' + trip.ended_at_date + '<br>' + trip.ended_at_time,
      line;

  if(trip.path) {
    line = L.polyline(polyline.decode(trip.path), lineStyle);
  } else {
    line = L.polyline([start, end], lineStyle);
  }

  line.addTo(map)

  map.fitBounds(line.getBounds(), {padding: [10, 10]});

  L.marker(start, {title: 'Start Location', icon: aIcon})
    .bindPopup(startPopupContent)
    .addTo(map);

  L.marker(end, {title: 'End Location', icon: bIcon})
    .bindPopup(endPopupContent)
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
