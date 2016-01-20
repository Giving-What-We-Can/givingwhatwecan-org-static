{% if quotation %}
	{% for quote in quotations %}
		{% if quote|contains(quotation,'slug') %}
			{% set quoteObj = quote %}
		{% endif %}
	{% endfor %}
	{% if quoteObj %}
		{% include '../partials/quotation-block.swig' with quoteObj only %}
	{% elif server %}
		<p><em>Quotation with slug <strong>{{quotation}}</strong> will appear here</em></p>
	{% endif %}
{% endif %}