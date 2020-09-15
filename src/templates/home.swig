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
	})


	</script>
{% endblock %}

{% block scripts %}
	{% parent %}
{% endblock %}
