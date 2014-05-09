var $ = require('jquery'),
    Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    app;

Backbone.$ = Marionette.$ = $;

app = new Marionette.Application(),

app.addRegions({
  test: '#test-container'
});

console.log('wha!?');


