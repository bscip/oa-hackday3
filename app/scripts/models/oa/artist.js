var $ = require('jquery'),
    Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('lodash'),
    OaArtist,
    Model,
    View,
    Collection,
    CollectionView;

Backbone.$ = Marionette.$ = $;

Model = Backbone.Model.extend({
  initialize: function() {
    var that = this;
    if (!_.has(that.attributes, 'name')) {
      that.set('name', 'default name');
    }
  }
});

View = Marionette.ItemView.extend({
  initialize: function() {
    var that = this;
  },
  render: function() {
    var template = _.template($('#template-oa-artist').html(), this.model.attributes);
    this.$el.html( template );
  },
  tagName: 'div',
  className: 'artist'
});

Collection = Backbone.Collection.extend({
  initialize: function(models) {
    var that = this;
  },
  comparator: function(model) {
    return model.get("name");
  },
  model: Model
});

CollectionView = Marionette.CollectionView.extend({
  initialize: function(models) {
    var that = this;
  },
  appendHtml: function(collectionView, itemView, index){
    var childrenContainer = collectionView.itemViewContainer ? collectionView.$(collectionView.itemViewContainer) : collectionView.$el;
    var children = childrenContainer.children();
    if (children.size() <= index) {
      childrenContainer.append(itemView.el);
    } else {
      children.eq(index).before(itemView.el);
    }
  },
  itemView: View, 
  className: 'artists'
});

OaArtist = {
  model: Model,
  view: View,
  collection: Collection,
  collectionView: CollectionView
}

module.exports = OaArtist;

