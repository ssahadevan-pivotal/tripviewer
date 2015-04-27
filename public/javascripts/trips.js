_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var trips,
    viewType = 'tile',
    tripTemplate = _.template($('#tripTile').html()),
    tripTableTemplate = _.template($('#tripTable').html()),
    tripTableHeader = _.template($('#tripTableHeader').html());

//fetch trips
fetchTrips(renderTrips);


//postpone drawing maps until we need them
$(window).scroll(drawMaps);


$('#refresh').click(function() {
  clearCache();
  deleteData();
  fetchTrips(renderTrips);
});


$('.display-type a').click(function() {
  viewType = $(this).data('type');
  $(this).addClass('active').siblings().removeClass('active')
  renderTrips();
  return false;
});


$('#trips').on('change', '#selectall', function() {
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
  var exportType = this.id
  var href = '/download/trips.' + exportType;
  if(viewType == 'table') {
    var trip_ids = $('.trip.table input[type="checkbox"]:checked').map(function() {
      return $(this).parents('.trip').data('trip_id');
    }).get();

    href += '?trip_ids=' + trip_ids.join(',');
  }
  $(this).attr('href', href);
});


function deleteData() {
  $('#trips').empty();
}


function selectAll() {
  $('#trips .trip input[type="checkbox"]').each(function(idx, checkbox) {
    $(checkbox).prop('checked', true);
  });
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
  $('#trips .trip input[type="checkbox"]').each(function(idx, checkbox) {
    $(checkbox).prop('checked', false);
  });
}


function renderTrips() {
  $('#trips')
    .empty()
    .removeClass()
    .addClass(viewType);

  if(viewType == 'tile') {
    trips.forEach(function(trip) {
      $('#trips').append($(tripTemplate(trip)).data('trip', trip));
    });
    selectAll();
  } else if(viewType == 'table') {
    $('#trips').append(tripTableHeader());

    trips.forEach(function(trip) {
      $('#trips').append(tripTableTemplate(trip));
    });
  }
  drawMaps();
  hideLoading();
}
