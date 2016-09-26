$(document).ready( function() {

  $('[data-toggle=collapse]').click( function() {

    var caret = $(this).find('i');
    caret.toggleClass('fa-caret-right');
    caret.toggleClass('fa-caret-down');
  });
});

