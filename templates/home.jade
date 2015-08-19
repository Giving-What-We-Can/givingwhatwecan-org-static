extends page

block header
	//- h1.page-title Welcome to the #{siteInfo.title}
	img.img-responsive#site-logo(src="/images/logos/gwwc-logo-banner.png")

block scripts
	script.
		// Only show site logo if user has scrolled past main logo
		(function($){
			$(document).ready(function(){
				// find the elements
				var nav =  $('#main-nav');
				var banner =  $('#site-logo');
				var logo =  $('#main-nav .navbar-brand>img');


				// function that detects scroll position and hides/shows logo accordingly
				var showLogo = function(hard){
					// hard transition on page load, otherwise fade
					if(nav.offset().top + nav.outerHeight() > banner.offset().top + banner.outerHeight()){
						if (hard) logo.show();
						else logo.fadeIn();
					} else {
						if(hard) logo.hide();
						else logo.fadeOut();
					}
				}
				showLogo(true);
				// scope var for debouncing 
				var timeOut;
				// listen for scrolling
				$(document).scroll(function(){
					// debounce by only calling function after 50ms
					clearTimeout(timeOut);
					timeOut = setTimeout(function(){
						showLogo();
						// call the function again after half a second — accounts for scroll momentum on iOS
						setTimeout(showLogo,500);
					},50);
				});
			});
		})(jQuery);