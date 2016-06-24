{% extends './layout.swig' %}

{% block banner %}
	{% include "./partials/banner.swig" %}
{% endblock %}


{% block content %}

	<div class="container">
		<div class="row">
			<div class="text-content">
				<section class="page-content">
					{{ contents }}
				</section>
				<div>
					{% include './partials/newsletter-signup.swig' %}
				</div>
			</div>
		</div>
	</div>

{% endblock %}