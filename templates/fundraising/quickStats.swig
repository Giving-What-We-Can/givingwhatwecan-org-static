<div class="row">
	{% set prefixes =    [					  '', 				 	 '', 					 '', 				  '$',							  '$'] %}
	{% set numbers = [						   4, 					569,	stats.numberMembers, 			stats.amountDonated, 	stats.amountPledged] %}
	{% set text =    ['top charities recommended', 'new members (2014-2015)', 'members in total', 'donations reported by members','pledged by members'] %}
	{% for number in numbers %}
		<div class="quick-stat {{text[loop.index0]|slug}}">
			<p>
				<span class="number">{{ prefixes[loop.index0] }}{{number|numeral('0,0')}}</span>
				<span class="text">{{ text[loop.index0] }}</span>
			</p>
		</div>
	{% endfor %}
</div>