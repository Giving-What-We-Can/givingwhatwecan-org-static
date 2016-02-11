{% extends './layout.swig' %}

{% block banner %}
	{% include "./partials/banner.swig" %}
{% endblock %}


{% block content %}

	<div class="container">
		{% include './partials/update-in-progress-warning.swig' %}
		<div class="row">
		<div class="col-xs-12">
			{% block basicInfo %}
				{% include './partials/research-entry-basic-info.swig' %}
			{% endblock %}
		</div>

		</div>
		<div class="row">
			<div class="col-md-9">
				<div class="page-content">
					{% if fastFacts && fastFacts.length>0 %}
					<section class="fast-facts">
						{% set f = {fastFacts:fastFacts} %}
						{% include './partials/fast-facts.swig' with f only %}
					</section>
					{% endif %}
					<section class="overview">
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