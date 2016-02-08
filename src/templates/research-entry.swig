{% extends './layout.swig' %}

{% block banner %}
	{% include "./partials/banner.swig" %}
{% endblock %}


{% block content %}

	<div class="container">
		<div class="row">
			<div class="col-md-9">
				<div class="page-content">

					{% block basicInfo %}{% endblock %}

					{% if fastFacts && fastFacts.length>0 %}
					<section class="fast-facts">
						{% set f = {fastFacts:fastFacts} %}
						{% include './partials/fast-facts.swig' with f only %}
					</section>
					{% endif %}


					<section class="overview">
						<h2>Overview</h2>
						{{ contents }}
					</section>

				</div>
				{% if report %}
				<div class="report">
					<div class="page-content">
						{% include './partials/full-report.swig' %}
					</div>
				</div>
				{% endif %}
			</div>
			<div class="col-md-3">
				<hr class="visible-xs visible-sm">
				<div class="related-content">
					{% block related %}{% endblock %}
				</div>
			</div>
		</div>
	</div>

{% endblock %}