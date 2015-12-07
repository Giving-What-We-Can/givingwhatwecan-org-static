{% set target = 475000 %}
{% set pledged = 193000 %}
{% set donated = 0 %}
{% set remaining = target - pledged - donated %}
{% set targetWidth = 100 %}
{% set pledgedWidth = pledged/target*100 %}
{% set donatedWidth = donated/target*100 %}
{% set remainingWidth = remaining/target*100 %}
<div id="progress-bar-wrapper">
	<h3>Fundraising Progress</h3>
	<div class="row">
		<div class="col-xs-12">
			<div style="width:100%" class="progress-bar clearfix">
				<div class="progress-bar-pledged progress-bar-component" style="width:{{pledgedWidth}}%">
					<p>Pledged: £{{pledged|numeral('0,0')}}</p>
				</div>
				{% if donated > 0 %}
				<div class="progress-bar-donated progress-bar-component" style="width:{{donatedWidth}}%">
					<p>Donated: £{{donated|numeral('0,0')}}</p>
				</div>
				{% endif %}
				<div class="progress-bar-remaining progress-bar-component" style="width:{{remainingWidth}}%">
					<p>Remaining: £{{remaining|numeral('0,0')}}</p>
				</div>
			</div>
			<div class="progress-bar-target progress-bar-component">
				<p>Target: £{{target|numeral('0,0')}}</p>
			</div>
		</div>
	</div>
</div>