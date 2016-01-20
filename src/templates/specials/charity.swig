{% if charity %}
	{% for c in charities %}
		{% if c|contains(charity,'slug') %}
			{#  #}
			{% set charityDisplay = charityDisplay || "default" %}
			{# pass the variables through  #}
			{% set v = {charity:c,display:charityDisplay} %}
			{% include '../partials/charity.swig' with v only %}
		{% endif %}
	{% endfor %}
	{% set charity = null %}
{% endif %}