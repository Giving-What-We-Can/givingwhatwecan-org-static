{% extends './layout.swig' %}

{% block banner %}

{% endblock %}

{% block content %}
  {{ contents }}
	{% include './partials/custom-alert.swig' %}
	{% include './partials/content-block-set.swig' %}
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
