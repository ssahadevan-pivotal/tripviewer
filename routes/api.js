var request = require('request'),
    csv = require('express-csv'),
    _ = require('underscore'),
    async = require('async'),
    helpers = require('../libs/helpers')
    apiUrl = 'https://api.automatic.com';


exports.trips = function(req, res, next) {
  async.parallel([
    function(cb) {
      downloadAllTrips(req, cb);
    },
    function(cb) {
      downloadVehicles(req, cb);
    }
  ], function(e, data) {
    if(e) return next(e);
    res.json(helpers.mergeTripsAndVehicles(data[0], data[1]));
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


exports.downloadTripsCSV = function(req, res, next) {
  async.parallel([
    function(cb) { downloadAllTrips(req, cb); },
    function(cb) { downloadVehicles(req, cb); }
  ], function(e, data) {
    if(e) return next(e);
    var trips = helpers.mergeTripsAndVehicles(data[0], data[1]);
    var tripsAsArray = trips.map(helpers.tripToArray);

    tripsAsArray.unshift(helpers.fieldNames());
    res.setHeader('Content-disposition', 'attachment; filename=trips.csv');
    res.csv(tripsAsArray);
  });
};


function downloadAllTrips(req, cb) {
  var uri = apiUrl + '/trip/',
      trip_ids = req.query.trip_ids,
      trips;

  //get first page of trips
  request.get({
    uri: uri,
    headers: {Authorization: 'bearer ' + req.user.accessToken},
    json: true,
    qs: { limit: 25 }
  }, function(e, r, body) {
    if(e) return cb(e);

    trips = body.results;
    var count = body['_metadata'] ? body['_metadata'].count : 0,
        pages = _.range(2, (Math.ceil(count / 25) + 1));

    if(count <= 25) {
      //no more pages
      filterAndSendTrips(trips, trip_ids, cb);
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
        if(e) return cb(e);

        trips = trips.concat(results);

        filterAndSendTrips(trips, trip_ids, cb);
      });
    }
  });
}


function filterAndSendTrips(trips, trip_ids, cb) {
  //if requesting only specific trips, just get those
  if(trip_ids) {
    trips = helpers.filterTrips(trips, trip_ids.split(','));
  }

  //sort trips by date
  trips = helpers.sortByDate(trips);

  cb(null, trips);
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
