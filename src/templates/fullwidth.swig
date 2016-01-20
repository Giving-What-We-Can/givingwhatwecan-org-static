{% extends './layout.swig' %}

{% block banner %}
	{% include "./partials/banner.swig" %}
{% endblock %}


{% block content %}


	<div class="content">
		{{ contents }}
	</div>

{% endblock %}