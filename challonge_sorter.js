$(function() {
  console.log("i'm here!");

  // configuration of the observer:
  var config = { attributes: true, childList: true, characterData: true, subtree: true };


  $('#new_participant').submit(function() {
    console.log('clicked motherfucker');

    var sortableSelector = 'ol#participants.participant-list.editable.sortable.ui-sortable';
    var sortable = $(sortableSelector);

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        console.log(mutation.type);
      });
    });


    // pass in the target node, as well as the observer options
    observer.observe(sortable[0], config);
    sortable.off();
  })
});
