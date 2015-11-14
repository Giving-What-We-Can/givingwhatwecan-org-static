{% set topCharities = [
	'against-malaria-foundation',
	'schistosomiasis-control-initiative',
	'deworm-the-world-initiative',
	'project-healthy-children'
] %}
<div class="row">
{% for topCharity in topCharities %}
	{% set charity = false %}
	{% for c in charities %}
		{% if c|contains(topCharity,'slug') %}
			{% set charity = c %}
		{% endif %}
	{% endfor %}
	{% if charity %}
		<div class="col-xs-6">
			<div class="charity {{charity.slug}}">
				<div class="logo">
					<a href="/top-charities/{{charity.page.fields.slug}}">
						<img src="{{charity.logo.fields.file.url}}?h=100">  
					</a>
				</div>
			</div>
		</div>
	{% endif %} 
{% endfor %}
</div>