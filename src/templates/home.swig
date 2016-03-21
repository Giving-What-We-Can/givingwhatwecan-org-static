{% extends './layout.swig' %}
{% set contentBlockSet = 'home' %}

{% block banner %}
	
{% endblock %}

{% block content %}
	{% include './partials/content-block-set.swig' %}
	<div class="container">
		{% include './partials/newsletter-signup.swig' %}
	</div>
	<script>
		loadScript(function(){
			var $ = window.jQuery;
			// Add down chevrons to content blocks
			$(function(){
				$(".content-block-wrapper").not(':first').not(':last').append('<a class="scroll-down scroll-down-chevron" href="#"><i class="icon icon-chevron-down"></i></a>');
				$('.scroll-down').click(function(e){
					e.preventDefault();
					var parent = $(this).parents('.content-block-wrapper');
					TweenLite.to(window, 1, {scrollTo:{y:parent.position().top+parent.outerHeight()}, ease:Power2.easeOut});
				})
			});

			/*
			
			SCROLLMAGIC!!!

			*/

			// init controller
			var controller = new ScrollMagic.Controller();

			/*
			
			Scene - fade and shrink nav at top of page

			*/

			// build scene
			var menuTimeline = new TimelineLite();
			menuTimeline.fromTo('#menu-main', 1, {
				backgroundColor:"rgba(108,0,0,0)",
				boxShadow:'none'
			}, {
				backgroundColor:"rgba(108,0,0,1)",
				boxShadow:'0px 0px 15px #333',
				ease:Power0.easeNone
			});


			new ScrollMagic.Scene({triggerElement: ".content-block-wrapper:first", duration: 400, triggerHook:0})
			// animate color and top border in relation to scroll position
			.setTween(menuTimeline)
			.addTo(controller);
	})

		
	</script>
{% endblock %}

{% block scripts %}
	{% parent %}
{% endblock %}