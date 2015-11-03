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
	{% parent %}
	<script>
		// Add down chevrons to all content blocks
		$(function(){
			$(".content-block-wrapper").not(':last').append($('.scroll-down'))
			$('.scroll-down').click(function(e){
				e.preventDefault();
				var position = $(this).parent('.content-block-wrapper').position();
				TweenLite.to(window, 1, {scrollTo:{y:position.top+$(this).parent('.content-block-wrapper').outerHeight()}, ease:Power2.easeOut});
			})
		});

		$.gwwcCalculator.controls();

		// Trigger SlabText after webfonts are loaded
		$(document).on('WebFont', function(event,status){
			if(status==='active'){
				$('.content-block widont').replaceWith(' ')
				$('#hero-image h2').slabText({viewportBreakpoint:380});
				$('#we-focus-on-impact h2').slabText({viewportBreakpoint:380});
				$('#our-top-charities-are-some-of-the-best h2').slabText({viewportBreakpoint:380});
				$('#how-rich-am-i h2').slabText({viewportBreakpoint:380});
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
		new ScrollMagic.Scene({triggerElement: "#we-are-giving-what-we-can", triggerHook:0.1})
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
		new ScrollMagic.Scene({triggerElement: "#we-focus-on-impact", triggerHook:0.1})
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
		new ScrollMagic.Scene({triggerElement: "#our-top-charities-are-some-of-the-best", triggerHook:0.1})
		.setTween(TopCharitiesTimeline)
		.addTo(controller)
		.on('enter leave',function(e){
			// console.log(e);
		})		

		/*
		
		Scene - count up member stats

		*/

		//
		// build properties
		var AmazingThingsNumbers = [];
		var numberEls = $("#our-members-have-done-some-amazing-things .number")
		numberEls.each(function(index){
			var el = $(this);
			el.attr('id','amazing-thing-number-'+index)
			var number = {
				id:el.attr('id'),
				total:parseInt(el.attr('data-number')),
				number:parseInt(el.attr('data-number')),
				prefix:el.attr('data-prefix')
			}
			AmazingThingsNumbers.push(number)
			el.text((number.prefix?number.prefix:'')+'...')
		})
		// build tween
		var AmazingThingsTimeline = new TimelineLite();
		AmazingThingsTimeline.staggerFrom(AmazingThingsNumbers, 1, {
			number:0,
			onUpdate:AmazingThingsUpdateHandler,
			ease:Quart.easeOut
		},0.3)
		// build scene
		new ScrollMagic.Scene({triggerElement: "#our-members-have-done-some-amazing-things", triggerHook:0.7})
		.setTween(AmazingThingsTimeline)
		.addTo(controller)

		function AmazingThingsUpdateHandler(){
			$.each(AmazingThingsNumbers,function(index,number){
				el = $('#'+number.id)
				if(number.number<10) {
					el.text((number.prefix?number.prefix:'')+'...')
				} else {
					el.text((number.prefix?number.prefix:'')+separateThousands(number.number))
				}
			})
		}
		function separateThousands(number){
			return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		}

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