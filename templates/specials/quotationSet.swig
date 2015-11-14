{% if quotationSet %}
{% for quote in quotations %}
{% if quote.set|contains(quotationSet) %}
	{% include '../partials/quotation-block.swig' with quote only %}
{% endif %}
{% endfor %}