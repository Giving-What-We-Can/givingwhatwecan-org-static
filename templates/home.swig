{% extends './layout.swig' %}

{% block banner %}
	
{% endblock %}

{% block content %}
	<h1>Test</h1>
	{% for contentblock in contentBlocks %}
	<p>Something</p>
		<h3>{{contentBlock}} !!</h3>
		{# {% set contentblock.page = 'home' %} #}
		{# {% if contentblock.pages.indexOf(contentblock.page) > -1 %} #}
			{% include './partials/content-block.swig' %}
		{# {% endif %} #}
	{% endfor %}
{% endblock %}

{% block scripts %}
	<script>
		(function($){

			// animate our 'we are giving what we can' statements
			$('.aim').attr('style','transition: opacity 1s ease-in-out;opacity:0;');
			var delay = 0;
			function doEffect(el){
				var el = $(el)
				setTimeout(function(){el.css({'opacity':1})},delay); 
				if($(window).width()>=992){
					delay+=300;
				}
			}
			$('.aim').each(function(){
				var el = $(this);
				el.waypoint(function(direction) {
					 doEffect($(this.element));
					this.destroy()
				}, {
				  offset: 'bottom-in-view'
				})
			})
			// create our effectiveness chart
			var effectivenessChart = $("#effectivenessChart");
			resizeChart(effectivenessChart);

			var effectivenessChartData = {
			    labels: ["Average Charities","Good Charities", "The Best Charities"],
			    datasets: [
			        {
			            label: "Charities",
			            fillColor: "#6C0000",
			            data: [0,0,0]
			        }
			    ]
			};
			var effectivenessChartOptions = {
				scaleBeginAtZero : false,
				scaleShowGridLines : false,
				barDatasetSpacing : 2,
			    showTooltips: false,
			    scaleFontFamily: '"Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif',
			    scaleOverride: true,
			    scaleSteps: 10,
			    scaleStepWidth: 100,
			    scaleStartValue: 0,
			}
			var ctx = effectivenessChart.get(0).getContext("2d");
			var effectivenessChartRender = new Chart(ctx).Bar(effectivenessChartData, effectivenessChartOptions);
			// use Waypoint to check whether the chart is in view
			effectivenessChart.waypoint(function(direction) {
				resizeChart(effectivenessChart);
				effectivenessChartRender.datasets[0].bars[0].value = 1;
				effectivenessChartRender.datasets[0].bars[1].value = 100;
				effectivenessChartRender.datasets[0].bars[2].value = 1000;
				effectivenessChartRender.update();
				this.destroy();
			}, {
			  offset: 'bottom-in-view'
			});
			function resizeChart(el){
				el = $(el);
				el.height(2 * Math.floor($(window).height()/4)); // round down to nearest even number or webkit font smoothing freaks out
				el.width(el.parent().width());
			}
		})(jQuery);
	</script>
{% endblock %}