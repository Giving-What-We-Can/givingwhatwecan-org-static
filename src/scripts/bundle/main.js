// code to make the window scroll smoothly on hash change move back by 
;(function($){
  var navHeight = $('#menu-main').outerHeight() + 20;
  var scrollHash = function(event) {
      scrollBy(0, -navHeight);
  };
  if (location.hash) scrollHash();
  $(window).on("hashchange", scrollHash);

})(jQuery)


// load content from the JSON version of a file
window.loadContent = function(path,callback){

	jQuery.get('/'+path+'.json')
	.done(function(data){
		callback(data)
	})
	.fail(function(){
		console.error('Error, could not load',path)
	})
}
