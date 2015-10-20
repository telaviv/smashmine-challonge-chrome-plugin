(function() {

  var newPMAConstructor = null;
  var collectionSize = null;
  var playerRankings = null;
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
    return sortPlayersRequest(collection).then(function(playerDatum) {
      playerRankings = playerDatum;

      var names = getNames(collection);
      names.forEach(function(name) {
        var elem = $('.participant-model [title="' + name + '"]');
        var playerData = getPlayerData(name, playerDatum);
        if (playerData.new) {
          elem.after('<span style="position:absolute;left:390px;">New Player</span>');
        }
        else if (playerData.max - playerData.min < 600) {
          elem.after('<span style="position:absolute;left:430px; color: #98FF88">' +
                     playerData.min.toFixed() + '</span>');
        } else {
          elem.after('<span style="position:absolute;left:430px; color: #FF2F3E">' +
                     playerData.min.toFixed() + '</span>');
        }
      });
    })
  };


  var sortPlayersRequest = function(collection) {
    var names = getNames(collection);
    return $.getJSON('http://smashmine.com/sort', {
      players: JSON.stringify(names)
    });
  };

  var sortPlayers = function(index, collection) {
    if (index === collection.size() - 1) {
      return;
    }
    var highModel = findHighestRankedParticipant(collection.models.splice(index));
    if (highModel.seed !== index + 1) {
      return highModel.updateSeed(index + 1).then(function() {
        sortPlayers(index + 1, collection);
      });
    } else {
      return sortPlayers(index + 1, collection);
    }
  };

  var findHighestRankedParticipant = function(participants) {
    var highestIndex = 0
    for (var i = 1; i < participants.length; ++i) {
      if (participantRanking(participants[i]).min >
          participantRanking(participants[highestIndex]).min) {
        highestIndex = i;
      }
    }
    return participants[highestIndex];
  }

  var participantRanking = function(participant) {
    return playerRankings.find(function(ranking) {
      return ranking.name === participant.get('name');
    });
  };

  var onCollectionChange = function() {
    var collection = this.collection;
    if (collection.size() === collectionSize){
      console.log('things are the same.');
      populateRankingStatistics(collection);
    } else if (collection.size() < collectionSize) {
      console.log('things are smaller.');
      collectionSize = collection.size();
    } else if (collection.size() > collectionSize) {
      console.log('things are larger.');
      collectionSize = collection.size();
      populateRankingStatistics(collection).done(
        function() {sortPlayers(0, collection);}
      );
    }
  };
})();
