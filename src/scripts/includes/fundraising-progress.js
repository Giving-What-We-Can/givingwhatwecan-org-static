(function($,numeral,TweenLite,cookies){

	// don't show if we've hidden the bar within a day, or seen the bar more than five times in total
	if(cookies.get('fundraisingBar') || cookies.get('fundraisingBarCount')>5){
		return;
	}
	var fundraisingBarCount = cookies.get('fundraisingBarCount')
	fundraisingBarCount = parseInt(cookies.get('fundraisingBarCount'))+1 || 1;
	console.log(fundraisingBarCount)
	// count the number of times we've seen the fundraising bar
	cookies.set('fundraisingBarCount', fundraisingBarCount + "",{expires: 10})

	var fundraisingProgressWrapper = $('.fundraising-progress-wrapper');
		if(fundraisingProgressWrapper.length) fundraisingProgressWrapper.hide();

	var fundraisingProgressContent = $('.fundraising-progress-content');
	fundraisingProgressContent.hide();
	var fundraisingProgressBar = fundraisingProgressContent.find('.fundraising-progress-bar');
	var donatedBar = fundraisingProgressContent.find('.donated');
	var donatedAmount = fundraisingProgressContent.find('.donated-amount');
	var remainingBar = fundraisingProgressBar.find('.remaining');
	var remainingAmount = fundraisingProgressBar.find('.remaining-amount');
	var targetAmount = fundraisingProgressBar.find('.target-amount');
	var daysLeftDisplay = fundraisingProgressContent.find('.days-left');

	var closeProgressBar = fundraisingProgressContent.find('.close-progress-bar');

	var body = $('body');

	var tl = new TimelineLite();
	var bodyPadding = body.css('padding-top');

	// handler for closing progress bar
	closeProgressBar.click(function(event){
		event.preventDefault();
		// set cookie to hide for a day
		cookies.set('fundraisingBar', "true", {expires: 1})

		tl
		.to(fundraisingProgressWrapper,0.6,{height:0,display:"none",ease: Back.easeIn.config(1.7)})
		.to(body,0.6,{paddingTop:bodyPadding+"px"},0)
	})

	
	// calculate days remaining
	daysLeft = daysLeft(daysLeftDisplay.attr('data-end-date'))
	daysLeftDisplay.text(daysLeft + (daysLeft>1 ? " days" : " day") )
	
	// update progress bar on the fly
	$.get('https://api.centreforeffectivealtruism.org/v1/fundraising/progress/gwwc',function(data){
		// set donated bar
		donatedBar.width(data.progress + '%');
		donatedAmount.text(numeral(data.donations).format('0,0'))
		// set remaining bar
		remainingBar.width( (100-data.progress) + '%')
		remainingAmount.text(numeral(data.difference).format('0,0'))
		// set target
		targetAmount.text(numeral(data.target).format('0,0'))

		// start reveal/animation
		fundraisingProgressContent.show();
		if(fundraisingProgressWrapper.length) {
			fundraisingProgressWrapper.show();
			var fundraisingProgressHeight = fundraisingProgressWrapper.outerHeight();
			tl
			.from(fundraisingProgressWrapper,0.6,{height:0,ease: Back.easeOut.config(1.7)},3)
			.to(body,0.6,{paddingTop:"+="+fundraisingProgressHeight+"px"},3)
		}
		tl
		.from(fundraisingProgressContent,0.6,{opacity:0})
		.from(donatedBar,1,{width:0})
		.from(remainingBar,1,{width:0})

	},'json')


	function daysLeft(endDate){
		var startDate = new Date;
		endDate = new Date(Date.parse(endDate));
		var oneDay = 24*60*60*1000;
		return Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)))
	}
})(jQuery,numeral,TweenLite,cookies)