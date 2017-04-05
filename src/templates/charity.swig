{% extends './layout.swig' %}

{% block banner %}
	{% include "./partials/banner.swig" %}
{% endblock %}


{% block content %}

	<div class="container">
		<div class="row" style='margin-bottom: 15px'>
			<div class="col-md-3">
				<img class="logo-image" src="{{logo.fields.file.url}}">
			</div>
			<div class="col-md-4">
				<p class="short-description">{{shortDescription}}</p>
				<a href="https://app.effectivealtruism.org/donations/new?utm_source=giving-what-we-can&utm_medium=partner_charity&utm_campaign=partner_charity_donations" target="_blank" class="btn btn-primary btn-block">
					<i class="icon icon-donate"></i> Donate with Effective Altruism Funds
				</a>
				{% if donationLink %}
						<a href="{{donationLink}}" target="_blank" class="btn btn-default btn-block">
							<i class="icon icon-donate"></i> Donate Directly
						</a>
				{% endif %}
				{% if website %}
						<a href="{{website}}" target="_blank" class="btn btn-default btn-block">
							<i class="fa fa-home"></i> Website
						</a>
				{% endif %}
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
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-9">
				{{ contents }}
			</div>
		</div>
		<div class='row'>
			<div class="col-sm-3">
				<a href="/donate/#the-uk-giving-what-we-can-trust" target="_blank" class="btn btn-primary btn-block">
					<i class="icon icon-donate"></i> Donate via the Trust
				</a>
			</div>
				{% if donationLink %}
					<div class="col-sm-3">
						<a href="{{donationLink}}" target="_blank" class="btn btn-default btn-block">
							<i class="icon icon-donate"></i> Donate Directly
						</a>
					</div>
				{% endif %}
				{% if website %}
					<div class="col-sm-3">
						<a href="{{website}}" target="_blank" class="btn btn-default btn-block">
							<i class="fa fa-home"></i> Website
						</a>
					</div>
				{% endif %}
		</div>
	</div>

{% endblock %}