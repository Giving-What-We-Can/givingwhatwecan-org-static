// code to make the window scroll smoothly on hash change move back by 
;(function($){
  var navHeight = $('#menu-main').outerHeight() + 20;
  var scrollHash = function(event) {
      scrollBy(0, -navHeight);
  };
  if (location.hash) scrollHash();
  $(window).on("hashchange", scrollHash);

})(jQuery)
