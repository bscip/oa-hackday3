var $ = require('jquery'),
    //OA = require('./oasdk/all.js'),
    ai = require('./oasdk/aura.js'),
    Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    OaArtist = require('./models/oa/artist'),
    oaArtists, oaArtistsView,
    app;

Backbone.$ = Marionette.$ = $;

app = new Marionette.Application();
window.app = app;

app.addRegions({
  oa_artists_container: '#oa-artists-container'
});

oaArtists = new OaArtist.collection();
oaArtistsView = new OaArtist.collectionView({
  collection: oaArtists
});

app.oa_artists_container.show(oaArtistsView);

oaArtists.add({name: 'test'});
oaArtists.add({name: 'blah'});

$('body').on('blur', '#oa-artists-input', function() {
  oaArtists.add({name: $(this).val()});
});

console.dir(ai);

