// code to make the window scroll smoothly on hash change move back by 
;(function($){
  var navHeight = $('#menu-main').outerHeight() + 20;
  var scrollHash = function(event) {
      scrollBy(0, -navHeight);
  };
  if (location.hash) scrollHash();
  $(window).on("hashchange", scrollHash);

})(jQuery)

// highlight footnotes when they're clicked
;(function($){
	var t;
	var removeHighlights = function (timeout) {
		timeout = timeout || false;
		clearTimeout(t);
		$('.footnote-item>p,.footnote-ref').removeClass('highlighted')
		if(timeout) {
			t = setTimeout(function(){removeHighlights()},10000)
		}
	}
	$('.footnote-ref a').click(function(){
		removeHighlights(true);
		$($(this).attr('href')+'>p').addClass('highlighted')
	})
	$('.footnote-backref').click(function(){
		removeHighlights(true);
		$($(this).attr('href')).parent('sup').addClass('highlighted')
	})

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


