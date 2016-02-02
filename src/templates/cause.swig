{% extends './research-entry.swig' %}

{% block related %}
<div class="row">
	<div class="col-sm-6 col-md-12">
		<section class="related related-charities">
			<h4>Related Charities</h4>
			<ul class="list-unstyled row">
			{% for charity in _charities %}
				{% set inc = false %}
				{% for cause in charity.causes %}
					{% if cause.sys.id === id %}
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
	<div class="col-sm-6 col-md-12">
		<section class="related related-reports">
			<h4>Related Reports</h4>
			<ul>
			{% for r in _reports %}
				{% set inc = false %}
				{% for cause in r.causes %}
					{% if cause.sys.id === id %}
						{% set inc = true %}
					{% endif %}
				{% endfor %}
				{% if inc %}
					<li class="related-item related-report">
						<a href="/{{r.path}}">
							{{r.title}}
						</a>
					</li>
				{% endif %}
			{% endfor %}
			</ul>
		</section>
	</div>
</div>
{% endblock %}