{% set target = 475000 %}
{% set donated = 206000 %}
{% set remaining = target-donated %}
{% set donatedWidth = donated/target*100 %}
{% set remainingWidth = 100 - donatedWidth %}
{% set remainingWidth = 100 - donatedWidth %}

<div class="fundraising-progress-content">
	<script>document.querySelector('.fundraising-progress-content').style.display = 'none';</script>
	<div class="row fundraising-progress-header">
		<div class="col-xs-12">
			<h3 class="regular-header">Fundraising Progress</h3>
			<h3 class="nav-header">Support a highly effective charity — only <span class="days-left" data-end-date="Dec 31, 2015">X days</span> left!</h3>
		</div>
	</div>
	<div class="row fundraising-progress-explanation">
		<div class="col-xs-12 col-md-10">
			<p><span class="gwwc">Giving What We Can</span> is fundraising for 2016. We've got a <a href="/fundraising#impact">great track record</a>, and we've got <a href="/fundraising#what-we-do-overview">big plans for the year ahead</a>. Please take just a few minutes to help us keep making the world better, more effectively.</p>
		</div>
		<div class="col-xs-12 col-md-2 center">
			<div class="row">
				<div class="col-xs-12 col-sm-6 col-md-12">
					<a href="/fundraising" class="btn btn-primary support">Learn More</a> 
				</div>
				<div class="col-xs-12 col-sm-6 col-md-12">
					<a href="#" class="btn btn-default close-progress-bar">Maybe later</a>
				</div>
			</div>
		</div>
	</div>
	<div class="row fundraising-progress-bar">
		<div class="col-xs-12">
			<div class="progress">
				<div class="progress-bar progress-bar-primary donated" style="width:{{donatedWidth}}%">
					£<span class="donated-amount">{{donated|numeral('0,0')}}</span> donated
				</div>
				<div class="progress-bar progress-bar-warning remaining" style="width: {{remainingWidth}}%">
					£<span class="remaining-amount">{{remaining|numeral('0,0')}}</span> remaining
				</div>
			</div>
		</div>
		<div class="col-xs-12">
			<div class="target">
				Target: £<span class="target-amount">{{target|numeral('0,0')}}</span>
			</div>
		</div>
	</div>
</div>

	<script>
	loadScript('fundraising-progress');
</script>