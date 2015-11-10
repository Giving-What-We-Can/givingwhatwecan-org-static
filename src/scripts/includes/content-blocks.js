;(function(ScrollMagic,TweenLite,TimelineLite,$){

	// reuse existing controller, or instantiate new one if needed
	window.controller = window.controller || new ScrollMagic.Controller();

	//
	var slabTextSelectors = []
	// Trigger SlabText after webfonts are loaded


	/*
		
	Block - #hero-image

	*/
	block("#hero-image",function(el,id){
		slabTextSelectors.push(id+' h2')
	})

	/*
		
	Block - #we-are-giving-what-we-can

	*/
	block("#we-are-giving-what-we-can", function(el,id){
		addScene(el,	function(){
			return new TimelineLite()
			.staggerFromTo('.aim', 0.6, {opacity:0,scale:0.7}, {opacity:1,scale:1,ease:Quart.easeOut}, 0.2)
		})
	})


	/*
	
	Block - "#we-focus-on-impact"

	*/
	block("#we-focus-on-impact",function(el,id){
		// Add header to slabtext
		slabTextSelectors.push(id + ' h2');

		// build chart with chartist
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
	                    axisTitle: 'Health',
	                    axisClass: 'ct-axis-title',
	                    offset: {
	                        x: 0,
	                        y: -3
	                    },
	                    flipTitle: false
	                }
	            })
	        ]
		}
		var chart = new Chartist.Bar(el.find('#impact-chart').get(0), data, options);
		

		chart.on('draw',function(data){
			// listen for draw event on chart before adding the timeline
			if(data.type==="bar" && data.index === 2){
				var baseline = data.y1
				// add scene to timeline
				addScene(el, function(){
					return new TimelineLite()
					.from('.comparison-chart', 0.6, {left:-1000,ease:Quart.easeOut})
					.from('.comparison-text', 0.6, {left:1000,ease:Quart.easeOut},0)
					.staggerFrom('.ct-bar', 0.6, {attr:{y2:baseline}},0.2)
				})
			}
		})
	})

	// /*
	
	// Block - #our-top-charities-are-some-of-the-best"

	// */
	block("#our-top-charities-are-some-of-the-best",function(el,id){
		// Add header to slabtext
		slabTextSelectors.push(id + ' h2');

		// add scene to timeline
		addScene(el, function(){
			return new TimelineLite()
			.staggerFrom('#our-top-charities-are-some-of-the-best .col-sm-6', 0.6, {opacity:0,top:100,ease:Quart.easeOut},0.2);
		})
	})

	// /*
	
	// Scene - count up member stats

	// */

	block("#our-members-have-done-some-amazing-things",function(el,id){

		// Add header to slabtext
		slabTextSelectors.push(id + ' h2');

		// add scene to timeline
		addScene(el,
			function(el){
				// build properties
				var AmazingThingsNumbers = [];
				var numberEls = el.find(".number")
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

				return new TimelineLite()
				.staggerFrom(AmazingThingsNumbers, 1, {
					number:0,
					onUpdate:AmazingThingsUpdateHandler,
					ease:Quart.easeOut
				},0.3)
			},
			{triggerHook:0.7}
		)
	})

	/*

	Block #how-rich-am-i

	*/
	block('#how-rich-am-i', function(el,id){
		slabTextSelectors.push(id+' h2');
		slabTextSelectors.push(id+' .heading p');
	})


	/*
	
	block — guard function to ensure that a block's associated scripts only execute if the block exists

	@param block: String, the ID of the content block you're targeting
	@param callback: Function, content block passed as jQuery object (plus ID string for convenince)

	*/

	function block(el,callback){
		var id = el;
		el = $('.content-block-wrapper'+el);
		// don't continue if the element isn't in the DOM
		if(el.length<1) return;
		
		callback(el,id)
	}

	/*
	
	addScene — convenience function for adding animations to the main ScrollMagic controller

	@param el: jQuery object of content block
	@param buildTimeline: Function, should return new TimelineLite instance
	@param sceneOptions: Object, additional options to pass to ScrollMagic

	*/

	function addScene(el,buildTimeline,sceneOptions){

		// buildTimeline should return a new TimelineLite instance, which can be added to Scrollmagic
		var timeline = buildTimeline(el)
		
		// set default scene options
		var defaultSceneOptions = {triggerElement: el, triggerHook:0.1};
		// merge defaults with sceneOptions if supplied
		if(typeof sceneOptions === 'object'){
			$.extend(defaultSceneOptions,sceneOptions);
		}

		// create the scene and add the timeline to it
		new ScrollMagic.Scene(defaultSceneOptions)
		.setTween(timeline)
		.addTo(window.controller);
	}

	// trigger any slabtext-ready elements
	$(document).on('WebFont', function(event,status){
		if(status==='active' && $.fn.slabText !== 'undefined'){
			$(slabTextSelectors.join(', ')).slabText({viewportBreakpoint:380});
		}
	})
	


})(ScrollMagic,TweenLite,TimelineLite,jQuery)