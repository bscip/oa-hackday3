var $ = require('jquery'),
    Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    app,
    Summoner = require('./models/summoner'),
    summoners, summonersView;

Backbone.$ = Marionette.$ = $;

app = new Marionette.Application(),

app.addRegions({
  test: '#test-container'
});

summoners = new Summoner.collection();
summonersView = new Summoner.collectionView({
  collection: summoners
});
app.test.show(summonersView);
summoners.add({name: 'blah'});
summoners.add({name: 'test'});
summoners.add({name: 'xxx'});
summoners.add({name: 'aaa'});



