{% if contentBlockSet %}
	{% include '../partials/content-block-set.swig' %}
{% else %}
<p><em>Error: variable contentBlockSet is false or undefined.</em></p>
{% endif %}