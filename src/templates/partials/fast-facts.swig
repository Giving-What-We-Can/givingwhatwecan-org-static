{% set facts = fastFacts.split("- ") %}
{% if facts.length >= 2 %}
	{% set facts = facts.slice(1) %}
	<div class="fast-facts-wrapper">
		<h2 class="fast-facts-heading">Fast Facts</h2>
		<ul class="fast-facts">
		{% for fact in facts %}
			<li class="fact"><i class="fa fa-lightbulb-o"></i> {{fact}}</li>
		{% endfor %}
		</ul>
	</div>
{% endif %}