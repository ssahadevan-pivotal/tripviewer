function fetchTrips(cb) {
  var ts = sessionStorage.getItem('ts');
  if(ts < Date.now() - (60*60*1000)) {
    showLoading();
    $.getJSON('/download/trips.json')
      .done(function(results) {
        trips = results;
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
          cb(data);
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
