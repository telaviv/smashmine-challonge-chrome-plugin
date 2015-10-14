(function() {

  var newPMAConstructor = null;
  var collectionSize = null;
  Object.defineProperty(window, 'ParticipantManagementApplication', {
    get: function() {
      return newPMAConstructor;
    },
    set: function(ParticipantManagementApplication) {
      var ProxyPMA = function(options) {
        var pma = new ParticipantManagementApplication(options)
        attachEventListeners(pma);
        window.pma = pma;
        return pma;
      }
      console.log('set that shit');
      newPMAConstructor = ProxyPMA;
    },
    enumerable: true,
    configurable: true
  });

  var attachEventListeners = function(pma) {
    pma.addInitializer(function() {
      var collection = this.subView.collection;
      collectionSize = collection.size();
      populateRankingStatistics(collection);
      collection.on("reset add remove",
        onCollectionChange,
        {collection: collection}
      );
    });
  };

  var getNames = function(collection) {
    return collection.models.map(function(model) {
      return model.get('display_name');
    })
  };

  var getPlayerData = function(name, data) {
    return data.find(function(elem) {
      return elem.name === name;
    });
  };

  var populateRankingStatistics = function(collection) {
    sortPlayersRequest(collection).done(function(playerDatum) {
      var names = getNames(collection);
      names.forEach(function(name) {
        var elem = $('.participant-model [title="' + name + '"]');
        var playerData = getPlayerData(name, playerDatum);
        elem.after('<span style="position:absolute;left:370px">' +
                   playerData.min.toFixed() + ' &mdash; ' +
                   playerData.max.toFixed() + '</span>');
      });
    })
  };


  var sortPlayersRequest = function(collection) {
    var names = getNames(collection);
    return $.getJSON('http://smashmine.com/sort', {
      players: JSON.stringify(names)
    });
  };

  var onCollectionChange = function() {
    var collection = this.collection;
    if (collection.size() === collectionSize){
      console.log('things are the same.');
    } else if (collection.size() < collectionSize) {
      console.log('things are smaller.');
      collectionSize = collection.size();
    } else if (collection.size() > collectionSize) {
      console.log('things are larger.');
      collectionSize = collection.size();
    }
  };

})();
