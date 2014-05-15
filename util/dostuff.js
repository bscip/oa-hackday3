var request = require('request'),
    async = require('async'),
    _ = require('lodash');
  

var DoStuff = (function() {
  var API_KEY;
  var DoStuff = function(key) {
    API_KEY = key;
  };

  DoStuff.prototype.constructor = DoStuff;


  DoStuff.prototype.test = function() {
    console.log('do stuff api ready to go');
  };

  DoStuff.prototype.eventsCount = function(cb) {
    var url = 'http://api.dostuffmedia.com/events.json?key='+API_KEY,
        per_page = 25,
        total_pages;

    request.get({url: url, json: true}, function(error, resp, data) { 
      if (data && _.has(data, 'events') && _.has(data.events, 'total_pages')) {
        total_pages = data.events.total_pages;
        request.get({url: url+'&page='+total_pages, json: true}, function(error, resp, data) { 
          if (data && _.has(data, 'events') && _.has(data.events, 'event')) {
            cb(null, {pages: total_pages, events: (per_page*(total_pages-1))+data.events.event.length});
          } else {
            cb('bad response', -1);
          }
        });
      } else {
        cb('bad response', -1);
      }
    });
  };

  DoStuff.prototype.eventsAll = function(cb) {
    var url = 'http://api.dostuffmedia.com/events.json?key='+API_KEY;

    async.waterfall([
      function(acb) {
        request.get({url: url, json: true}, function(error, resp, data) { 
          if (data && _.has(data, 'events') && _.has(data.events, 'total_pages')) {
            acb(null, data.events.total_pages);
          } else {
            acb(null, 0);
          }
        });
      },
      function(numpages, acb) {
        var i;
        event_getters = [],
        url = 'http://api.dostuffmedia.com/events.json?key='+API_KEY;

        for(i = 1; i <= numpages; i++) {
          (function(i) {
            event_getters.push(function(pcb) {
              request.get({url: url+'&page='+i, json: true}, function(error, resp, data) { 
                if (data && _.has(data, 'events') && _.has(data.events, 'event')) {
                  pcb(null, data.events.event);
                }
              });
            });
          }(i));
        }

        async.parallel(
          event_getters,
          function(err, results) {
            acb(null, _.flatten(results,true));
          }
        );
      },
    ],
    function(err, result) {
      cb(null, result);
    });
  };

  DoStuff.prototype.eventsPage = function(params, cb) {
    var url = 'http://api.dostuffmedia.com/events.json?key='+API_KEY+'&page='params.page;
    request.get({url: url, json: true}, function(error, resp, data) { 
      if (data) {
        cb(null, data);
      } else {
        cb('bad response', null);
      }
    });
  };

  DoStuff.prototype.event = function(params, cb) {
    var url = 'http://api.dostuffmedia.com/events/'+params.event_id+'.json?key='+API_KEY;
    request.get({url: url, json: true}, function(error, resp, data) { 
      if (data) {
        cb(null, data);
      } else {
        cb('bad response', null);
      }
    });
  };

  DoStuff.prototype.eventVotes = function(params, cb) {
    var url = 'http://api.dostuffmedia.com/events/'+params.event_id+'/current_votes.json?key='+API_KEY;
    request.get({url: url, json: true}, function(error, resp, data) { 
      if (data && _.has(data, 'event') && _.has(data.event, 'votes')) {
        cb(null, data.event.votes);
      } else {
        cb('bad response', null);
      }
    });
  };

  DoStuff.prototype.bandsCount = function(cb) {
    var url = 'http://api.dostuffmedia.com/bands.json?key='+API_KEY,
        per_page = 25,
        total_pages;

    request.get({url: url, json: true}, function(error, resp, data) { 
      if (data && _.has(data, 'bands') && _.has(data.bands, 'total_pages')) {
        total_pages = data.bands.total_pages;
        request.get({url: url+'&page='+total_pages, json: true}, function(error, resp, data) { 
          if (data && _.has(data, 'bands') && _.has(data.bands, 'band')) {
            cb(null, {pages: total_pages, bands: (per_page*(total_pages-1))+data.bands.band.length});
          } else {
            cb('bad response', -1);
          }
        });
      } else {
        cb('bad response', -1);
      }
    });
  };

  DoStuff.prototype.bandsAll = function(cb) {
    var url = 'http://api.dostuffmedia.com/bands.json?key='+API_KEY;

    async.waterfall([
      function(acb) {
        request.get({url: url, json: true}, function(error, resp, data) { 
          if (data && _.has(data, 'bands') && _.has(data.bands, 'total_pages')) {
            acb(null, data.bands.total_pages);
          } else {
            acb(null, 0);
          }
        });
      },
      function(numpages, acb) {
        var i;
        band_getters = [],
        url = 'http://api.dostuffmedia.com/bands.json?key='+API_KEY;

        for(i = 1; i <= numpages; i++) {
          (function(i) {
            band_getters.push(function(pcb) {
              request.get({url: url+'&page='+i, json: true}, function(error, resp, data) { 
                if (data && _.has(data, 'bands') && _.has(data.bands, 'band')) {
                  pcb(null, data.bands.band);
                }
              });
            });
          }(i));
        }

        async.parallel(
          band_getters,
          function(err, results) {
            acb(null, _.flatten(results,true));
          }
        );
      },
    ],
    function(err, result) {
      cb(null, result);
    });
  };

  DoStuff.prototype.bandsPage = function(params, cb) {
    var url = 'http://api.dostuffmedia.com/bands.json?key='+API_KEY+'&page='params.page;
    request.get({url: url, json: true}, function(error, resp, data) { 
      if (data) {
        cb(null, data);
      } else {
        cb('bad response', null);
      }
    });
  };

  DoStuff.prototype.band = function(params, cb) {
    var url = 'http://api.dostuffmedia.com/bands/'+params.band_id+'.json?key='+API_KEY;
    request.get({url: url, json: true}, function(error, resp, data) { 
      if (data) {
        cb(null, data);
      } else {
        cb('bad response', null);
      }
    });
  };

  DoStuff.prototype.bandVotes = function(params, cb) {
    var url = 'http://api.dostuffmedia.com/bands/'+params.band_id+'/current_votes.json?key='+API_KEY;
    request.get({url: url, json: true}, function(error, resp, data) { 
      if (data && _.has(data, 'band') && _.has(data.band, 'votes')) {
        cb(null, data.band.votes);
      } else {
        cb('bad response', null);
      }
    });
  };

  DoStuff.prototype.venuesCount = function(cb) {
    var url = 'http://api.dostuffmedia.com/venues.json?key='+API_KEY,
        per_page = 25,
        total_pages;

    request.get({url: url, json: true}, function(error, resp, data) { 
      if (data && _.has(data, 'venues') && _.has(data.venues, 'total_pages')) {
        total_pages = data.venues.total_pages;
        request.get({url: url+'&page='+total_pages, json: true}, function(error, resp, data) { 
          if (data && _.has(data, 'venues') && _.has(data.venues, 'venue')) {
            cb(null, {pages: total_pages, venues: (per_page*(total_pages-1))+data.venues.venue.length});
          } else {
            cb('bad response', -1);
          }
        });
      } else {
        cb('bad response', -1);
      }
    });
  };

  DoStuff.prototype.venuesAll = function(cb) {
    var url = 'http://api.dostuffmedia.com/venues.json?key='+API_KEY;

    async.waterfall([
      function(acb) {
        request.get({url: url, json: true}, function(error, resp, data) { 
          if (data && _.has(data, 'venues') && _.has(data.venues, 'total_pages')) {
            acb(null, data.venues.total_pages);
          } else {
            acb(null, 0);
          }
        });
      },
      function(numpages, acb) {
        var i;
        venue_getters = [],
        url = 'http://api.dostuffmedia.com/venues.json?key='+API_KEY;

        for(i = 1; i <= numpages; i++) {
          (function(i) {
            venue_getters.push(function(pcb) {
              request.get({url: url+'&page='+i, json: true}, function(error, resp, data) { 
                if (data && _.has(data, 'venues') && _.has(data.venues, 'venue')) {
                  pcb(null, data.venues.venue);
                }
              });
            });
          }(i));
        }

        async.parallel(
          venue_getters,
          function(err, results) {
            acb(null, _.flatten(results,true));
          }
        );
      },
    ],
    function(err, result) {
      cb(null, result);
    });
  };

  DoStuff.prototype.venuesPage = function(params, cb) {
    var url = 'http://api.dostuffmedia.com/venues.json?key='+API_KEY+'&page='params.page;
    request.get({url: url, json: true}, function(error, resp, data) { 
      if (data) {
        cb(null, data);
      } else {
        cb('bad response', null);
      }
    });
  };

  DoStuff.prototype.venue = function(params, cb) {
    var url = 'http://api.dostuffmedia.com/venues/'+params.venue_id+'.json?key='+API_KEY;
    request.get({url: url, json: true}, function(error, resp, data) { 
      if (data) {
        cb(null, data);
      } else {
        cb('bad response', null);
      }
    });
  };

  return DoStuff;
})();

module.exports = DoStuff;
