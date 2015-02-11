var request = require('request'),
    csv = require('express-csv'),
    _ = require('underscore'),
    async = require('async'),
    moment = require('moment-timezone'),
    apiUrl = 'https://api.automatic.com';


exports.trips = function(req, res, next) {
  request.get({
    uri: apiUrl + '/trip/',
    qs: { page: req.query.page },
    headers: {Authorization: 'bearer ' + req.user.accessToken},
    json: true
  }, function(e, r, body) {
    if(e) return next(e);
    res.json(body.results);
  });
};


exports.trip = function(req, res, next) {
  request.get({
    uri: apiUrl + '/trip/' + req.params.id,
    headers: {Authorization: 'bearer ' + req.user.accessToken},
    json: true
  }, function(e, r, body) {
    if(e) return next(e);
    res.json(body);
  });
};


exports.vehicles = function(req, res, next) {
  downloadVehicles(req, function(e, vehicles) {
    if(e) return next(e);
    res.json(vehicles);
  });
};


exports.downloadTripsJSON = function(req, res, next) {
  async.parallel([
    function(cb) { downloadAllTrips(req, cb); },
    function(cb) { downloadVehicles(req, cb); }
  ], function(e, data) {
    if(e) return next(e);
    res.json(mergeTripsAndVehicles(data[0], data[1]));
  });
};


exports.downloadTripsCSV = function(req, res, next) {
  async.parallel([
    function(cb) { downloadAllTrips(req, cb); },
    function(cb) { downloadVehicles(req, cb); }
  ], function(e, data) {
    if(e) return next(e);
    var trips = mergeTripsAndVehicles(data[0], data[1]);
    var tripsAsArray = trips.map(tripToArray);
    tripsAsArray.unshift(fieldNames());
    res.setHeader('Content-disposition', 'attachment; filename=trips.csv');
    res.csv(tripsAsArray);
  });
};


function downloadAllTrips(req, cb) {
  var uri = apiUrl + '/trip/',
      trips;

  //get first page of trips
  request.get({
    uri: uri,
    headers: {Authorization: 'bearer ' + req.user.accessToken},
    json: true,
    qs: { limit: 25 }
  }, function(e, r, body) {
    if(e) return next(e);

    trips = body.results;
    var count = body['_metadata'] ? body['_metadata'].count : 0,
        pages = _.range(2, (Math.ceil(count / 25) + 1));

    if(count <= 25) {
      //no more pages
      filterAndSendTrips();
    } else {
      //get the next set of pages in parallel
      async.concat(pages, function(page, cb) {
        request.get({
          uri: uri,
          headers: {Authorization: 'bearer ' + req.user.accessToken},
          json: true,
          qs: {
            limit: 25,
            page: page
          }
        }, function(e, r, body) {
          cb(e, body.results);
        });
      }, function(e, results) {
        trips = trips.concat(results);

        filterAndSendTrips(e);
      });
    }
  });

  function filterAndSendTrips(e) {
    //if requesting only specific trips, just get those
    if(req.query.trip_ids) {
      var trip_ids = req.query.trip_ids.split(',');
      trips = filterTrips(trips, trip_ids);
    }

    //sort trips by date
    trips = _.sortBy(trips, function(trip) {
      return -moment(trip.started_at).valueOf();
    });

    cb(e, trips);
  }
}


function downloadVehicles (req, cb) {
  request.get({
    uri: apiUrl + '/vehicle/',
    headers: {Authorization: 'bearer ' + req.user.accessToken},
    json: true
  }, function(e, r, body) {
    cb(e, body.results);
  });
}


function filterTrips(trips, trip_ids) {
  return _.filter(trips, function(trip) {
    return trip_ids.indexOf(trip.id) != -1;
  });
};


function fieldNames() {
  return [
    'Vehicle',
    'Start Location Name',
    'Start Location Lat',
    'Start Location Lon',
    'Start Location Accuracy (meters)',
    'Start Time',
    'End Location Name',
    'End Location Lat',
    'End Location Lon',
    'End Location Accuracy (meters)',
    'End Time',
    'Path',
    'Distance (mi)',
    'Duration (seconds)',
    'Hard Accelerations',
    'Hard Brakes',
    'Duration Over 80 mph (secs)',
    'Duration Over 75 mph (secs)',
    'Duration Over 70 mph (secs)',
    'Fuel Cost (USD)',
    'Fuel Volume (l)',
    'Average MPG'
  ];
};


function tripToArray(t) {
  return [
    formatVehicle(t.vehicle),
    (t.start_address) ? t.start_address.name : '',
    t.start_location.lat,
    t.start_location.lon,
    t.start_location.accuracy_m,
    t.started_at,
    (t.end_address) ? t.end_address.name : '',
    t.end_location.lat,
    t.end_location.lon,
    t.end_location.accuracy_m,
    t.ended_at,
    t.path,
    formatDistance(t.distance_m),
    t.duration_s,
    t.hard_accels,
    t.hard_brakes,
    t.duration_over_80_s,
    t.duration_over_75_s,
    t.duration_over_70_s,
    formatFuelCost(t.fuel_cost_usd),
    t.fuel_volume_l,
    t.average_mpg
  ];
};


function formatVehicle(v) {
  return [(v.year || ''), (v.make || ''), (v.model || '')].join(' ');
};


function formatDistance(distance) {
  //convert from m to mi
  return (distance / 1609.34).toFixed(2);
};


function formatFuelCost(fuelCost) {
  return '$' + fuelCost.toFixed(2);
};


function mergeTripsAndVehicles(trips, vehicles) {
  var vehicleObj = _.object(_.pluck(vehicles, 'url'), vehicles);

  return trips.map(function(trip) {
    trip.vehicle = vehicleObj[trip.vehicle];
    return trip;
  });
}
