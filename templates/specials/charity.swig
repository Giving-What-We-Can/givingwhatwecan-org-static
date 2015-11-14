{% if charity %}
	{% for c in charities %}
		{% if c|contains(charity,'slug') %}
			{% include '../partials/charity.swig' with c only %}
		{% endif %}
	{% endfor %}
	{% set charity = null %}
{% endif %}