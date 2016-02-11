{% extends './research-entry.swig' %}

{% block related %}
<div class="row">
	{% if causes && causes.length>0 %}
	<div class="col-sm-6 col-md-12">
		<section class="related related-causes">
			<h4>Related Cause Areas</h4>
			<ul>
			{% for cause in _causes %}
				{% set inc = false %}
				{% for c in causes %}
					{% if c.sys.id === cause.id %}
						<li class="related-item related-cause">
							<a href="/{{cause.path}}">
								{{cause.title}}
							</a>
						</li>
					{% endif %}
				{% endfor %}
			{% endfor %}
			</ul>
		</section>
	</div>
	{% endif %}

	<div class="col-sm-6 col-md-12">
		<section class="related related-reports">
			<h4>Related Reports</h4>
			<ul>
			{% for r in _reports %}
				{% set inc = false %}
				{% for cause in r.causes %}
					{% for c in causes %}
						{% if cause.sys.id === c.sys.id %}
							{% set inc = true %}
						{% endif %}
					{% endfor %}
				{% endfor %}
				{% for charity in r.charities %}
					{% if charity.sys.id === id %}
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
		</div>
	</section>
</div>
{% endblock %}