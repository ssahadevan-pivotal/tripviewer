function fetchData(cb) {
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

function cacheTrips(trips) {
  var order = _.pluck(trips, 'id');
  sessionStorage.setItem('order', JSON.stringify(order));
  sessionStorage.setItem('ts', Date.now());

  trips.forEach(function(trip) {
    sessionStorage.setItem(trip.id, JSON.stringify(trip));
  });
}

function getCachedTrips() {
  var order = JSON.parse(sessionStorage.getItem('order') || '[]');

  return order.map(function(trip_id) { return JSON.parse(sessionStorage.getItem(trip_id) || {}); });
}


function clearCache() {
  sessionStorage.clear();
}
