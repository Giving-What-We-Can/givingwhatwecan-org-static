{% extends './page.swig' %}

{% block content %}
<div class="container">
	<div class="row">
		<div class="col-md-9">
			{% include "./partials/postDetails.swig" %}
			<section class="page-content">
				{{contents}}
			</section>
		</div>
		<div class="col-md-3">
			<hr class="visible-xs visible-sm">
			<div class="related-content">
				<div class="row">
					{% if causes && causes.length>0 %}
					<div class="col-sm-4 col-md-12">

						<section class="related related-causes">
							<h4>Related Cause Areas</h4>
							<ul>
							{% for cause in _causes %}
								{% set inc = false %}
								{% for c in causes %}
									{% if cause.id === c.sys.id %}
										{% set inc = true %}
									{% endif %}
								{% endfor %}
								{% if inc %}
									<li class="related-item related-cause">
										<i class="fa fa-heartbeat"></i>
										<a href="/{{cause.path}}">{{cause.title}}</a>
									</li>
								{% endif %}
							{% endfor %}
							</ul>
						</section>
					</div>
					{% endif %}
					
					{% if charities && charities.length>0 %}
					<div class="col-sm-4 col-md-12">
						<section class="related related-charities">
							<h4>Related Charities</h4>
							<ul class="list-unstyled row">
							{% for charity in _charities %}
								{% set inc = false %}
								{% for c in charities %}
									{% if c.sys.id === charity.id %}
										{% set inc = true %}
									{% endif %}
								{% endfor %}
								{% if inc %}
									<li class="related-item related-charity col-xs-6">
										<a href="/{{charity.path}}">
											<img src="{{charity.logo.fields.file.url}}">
											<p class="sr-only">{{charity.title}}</p>
										</a>

									</li>
								{% endif %}
							{% endfor %}
							</ul>
						</section>
					</div>
					{% endif %}

					<div class="col-sm-4 col-md-12">
						<section class="related related-reports">
							<h4>Related Reports</h4>
							<ul>
							{% for report in _reports %}
								{% set inc = false %}
								{% for cause in causes %}
									{% for c in report.causes %}
										{% if cause.sys.id === c.sys.id  %}
											{% set inc = true %}
										{% endif %}
									{% endfor %}
								{% endfor %}
								{% for charity in charities %}
									{% for c in report.charities %}
										{% if charity.sys.id === c.sys.id  %}
											{% set inc = true %}
										{% endif %}
									{% endfor %}
								{% endfor %}
								{% if inc && report.id !== id %}
									<li class="related-item related-report">
										<i class="fa fa-file-text-o"></i>
										<a href="/{{report.path}}">{{report.title}}</a>
									</li>
								{% endif %}
							{% endfor %}
							</ul>
						</section>		
					</div>
					
				</div>
			</div>
		</div>
	</div>
</div>
{% endblock %}