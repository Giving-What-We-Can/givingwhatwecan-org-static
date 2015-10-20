{% extends './layout.swig' %}
{% set contentBlockSet = 'home' %}

{% block banner %}
	
{% endblock %}

{% block content %}
	{% include './partials/content-block-set.swig' %}
	<a class="scroll-down" href="#"><i class="fa fa-chevron-down"></i></a>
{% endblock %}

{% block scripts %}
	{# {% include './partials/content-block-scripts.swig' %} #}

	<script>
		
		$(function(){
			$(".content-block-wrapper").not(':last').append($('.scroll-down'))
			$('.scroll-down').click(function(e){
				e.preventDefault();
				var position = $(this).parent('.content-block-wrapper').position();
				TweenLite.to(window, 1, {scrollTo:{y:position.top+$(this).parent('.content-block-wrapper').outerHeight()}, ease:Power2.easeOut});
			})
		});

		// Trigger SlabText after webfonts are loaded
		$(document).on('WebFont', function(event,status){
			if(status==='active'){
				$('.content-block widont').replaceWith(' ')
				$('#hero-image h2').slabText({viewportBreakpoint:380});
				$('#we-focus-on-impact h2').slabText({viewportBreakpoint:380});
				$('#our-top-charities-are-some-of-the-best h2').slabText({viewportBreakpoint:380});
			}
		})


		/*
		
		SCROLLMAGIC!!!

		*/

		// init controller
		var controller = new ScrollMagic.Controller({globalSceneOptions: {}});

		/*
		
		Scene - fade and shrink nav at top of page

		*/

		// build scene
			var menuTimeline = new TimelineLite();
			menuTimeline.fromTo('#menu-main', 1, {backgroundColor:"rgba(108,0,0,0)",boxShadow:'none'}, {backgroundColor:"rgba(108,0,0,1)",boxShadow:'0px 0px 15px #333',ease:Quart.easeOut});
			var scene = new ScrollMagic.Scene({triggerElement: "#hero-image", duration: 400, triggerHook:0})
			// animate color and top border in relation to scroll position
			.setTween(menuTimeline)
			.addTo(controller);


		/*
		
		Scene - highlight aims in 'we are giving what we can'

		*/

		// build tween
		var aimTimeline = new TimelineLite();
		aimTimeline.staggerFromTo('.aim', 0.6, {opacity:0,scale:0.7}, {opacity:1,scale:1,ease:Quart.easeOut}, 0.2);
		// build scene
		var aimScene = new ScrollMagic.Scene({triggerElement: "#we-are-giving-what-we-can", triggerHook:0.1})
		aimScene
		.setTween(aimTimeline)
		.addTo(controller)
		.on('enter leave',function(e){
			// console.log(e);
		})

		/*
		
		Scene - highlight impact chart

		*/

		// build tween
		var ChartTimeline = new TimelineLite();
		ChartTimeline.from('.comparison-chart', 0.6, {left:-1000,ease:Quart.easeOut});
		ChartTimeline.from('.comparison-text', 0.6, {left:1000,ease:Quart.easeOut},0);
		// build scene
		var chartScene = new ScrollMagic.Scene({triggerElement: "#we-focus-on-impact", triggerHook:0.1})
		chartScene
		.setTween(ChartTimeline)
		.addTo(controller)
		.on('enter leave',function(e){
			// console.log(e);
		})


		/*
		
		Scene - highlight top charities

		*/

		// build tween
		var TopCharitiesTimeline = new TimelineLite();
		TopCharitiesTimeline.staggerFrom('#our-top-charities-are-some-of-the-best .col-sm-6', 0.6, {opacity:0,top:100,ease:Quart.easeOut},0.2);
		// build scene
		var chartScene = new ScrollMagic.Scene({triggerElement: "#our-top-charities-are-some-of-the-best", triggerHook:0.1})
		chartScene
		.setTween(TopCharitiesTimeline)
		.addTo(controller)
		.on('enter leave',function(e){
			// console.log(e);
		})


		/*
		
		CHARTIST!

		*/

		var data = {
		  labels: ['Average Charities', 'Good Charities', 'The Best Charities'],
		  series: [
		    [10,100,1500]
		  ]
		};
		var options = {
			chartPadding: {
				top: 0,
				right: 0,
				bottom: 30,
				left: 30
			},
			plugins: [
                Chartist.plugins.ctAxisTitle({
                    axisX: {
                        axisTitle: 'Charity Type',
                        axisClass: 'ct-axis-title',
                        offset: {
                            x: 0,
                            y: 50
                        },
                        textAnchor: 'middle'
                    },
                    axisY: {
                        axisTitle: 'Impact',
                        axisClass: 'ct-axis-title',
                        offset: {
                            x: 0,
                            y: -1
                        },
                        flipTitle: false
                    }
                })
            ]
		}

		new Chartist.Bar('#impact-chart', data, options);

		
	</script>
{% endblock %}