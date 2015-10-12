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
      collection.on("reset add remove", function() {
        if (collection.size() === collectionSize){
          console.log('things are the same.');
        } else if (collection.size() < collectionSize) {
          console.log('things are smaller.');
          collectionSize = collection.size();
        } else if (collection.size() > collectionSize) {
          console.log('things are larger.');
          collectionSize = collection.size();
        }
      });
    });
  };

})();
