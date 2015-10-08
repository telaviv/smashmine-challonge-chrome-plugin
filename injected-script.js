var newPMAConstructor = null;
Object.defineProperty(window, 'ParticipantManagementApplication', {
  get: function() {
    return newPMAConstructor;
  },
  set: function(ParticipantManagementApplication) {
    var ProxyPMA = function(options) {
      var pma = new ParticipantManagementApplication(options)
      window.pma = pma;
      return pma;
    }
    console.log('set that shit');
    newPMAConstructor = ProxyPMA;
  },
  enumerable: true,
  configurable: true
});
