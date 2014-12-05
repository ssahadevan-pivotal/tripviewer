function fetchTrips(cb) {
  var ts = sessionStorage.getItem('ts');
  if(ts < Date.now() - (60*60*1000)) {
    showLoading();
    $.getJSON('/download/trips.json')
      .done(function(results) {
        trips = results.map(formatTrip);
        cacheTrips(trips);
        cb(trips);
        hideLoading();
      });
  } else {
    trips = getCachedTrips();
    cb(trips);
  }
}


function fetchTrip(trip_id, cb) {
  var cached = sessionStorage.getItem(trip_id);
  if(cached) {
    cb(JSON.parse(cached));
  } else {
    showLoading();
    $.getJSON('/api/trips/' + trip_id)
      .done(function(data) {
        hideLoading();
        if(data) {
          cb(formatTrip(data));
        } else {
          showAlert('No trips found', 'warning');
        }
      })
      .fail(function(jqhxr, textStatus, error) {
        showAlert('Unable to fetch trip (' +jqhxr.status + ' ' + error + ')', 'danger');
      });
  }
}


function fetchVehicles(cb) {
  var vehicles = JSON.parse(sessionStorage.getItem('vehicles') || '[]');
  if(vehicles.length) {
    cb(vehicles);
  } else {
    showLoading();
    $.getJSON('/api/vehicles/')
      .done(function(results) {
        vehicles = results;
        cacheVehicles(vehicles);
        cb(vehicles);
        hideLoading();
      })
      .fail(function(jqhxr, textStatus, error) {
        showAlert('Unable to fetch vehicles (' +jqhxr.status + ' ' + error + ')', 'danger');
      });
  }
}


function cacheTrips(trips) {
  var order = _.pluck(trips, 'id');
  sessionStorage.setItem('order', JSON.stringify(order));
  sessionStorage.setItem('ts', Date.now());

  trips.forEach(function(trip) {
    sessionStorage.setItem(trip.id, JSON.stringify(trip));
  });
}


function cacheVehicles(vehicles) {
  sessionStorage.setItem('vehicles', JSON.stringify(vehicles));
}


function getCachedTrips() {
  var order = JSON.parse(sessionStorage.getItem('order') || '[]');

  return order.map(function(trip_id) { return JSON.parse(sessionStorage.getItem(trip_id) || {}); });
}


function clearCache() {
  sessionStorage.clear();
}


function formatTrip(trip) {
  return _.extend(trip, {
    title: 'Drive to ' + formatAddress(trip.end_address) + ' on ' + formatDate(trip.started_at),
    ended_at_formatted: formatTime(trip.ended_at),
    duration: formatDuration(trip.duration_s),
    started_at_formatted: formatTime(trip.started_at),
    end_address: formatAddress(trip.end_address),
    distance: formatDistance(m_to_mi(trip.distance_m)),
    average_mpg: formatMPG(trip.average_mpg),
    fuel_cost_usd: formatFuelCost(trip.fuel_cost_usd),
    hard_brakes_class: (trip.hard_brakes > 0 ? 'someHardBrakes' : 'noHardBrakes'),
    hard_brakes: trip.hard_brakes || '<i class="glyphicon glyphicon-ok"></i>',
    hard_accels_class: (trip.hard_accels > 0 ? 'someHardAccels' : 'noHardAccels'),
    hard_accels: trip.hard_accels || '<i class="glyphicon glyphicon-ok"></i>',
    speeding_class: (formatSpeeding(trip.duration_over_70_s) > 0 ? 'someSpeeding' : 'noSpeeding'),
    speeding: Math.ceil(trip.duration_over_70_s/60) || '<i class="glyphicon glyphicon-ok"></i>',
    start_address: formatAddress(trip.start_address)
  });
}
