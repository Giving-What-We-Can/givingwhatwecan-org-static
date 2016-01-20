{% extends './layout.swig' %}

{% block banner %}
	{% include "./partials/banner.swig" %}
{% endblock %}


{% block content %}

	<div class="container">
		<div class="row">
			<div class="page">
				<section class="page-content">
					{{ contents }}
				</section>
			</div>
		</div>
	</div>

{% endblock %}