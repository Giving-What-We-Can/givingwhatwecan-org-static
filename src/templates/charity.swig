{% extends './research-entry.swig' %}

{% block basicInfo %}
	<div class="row basic-info">
		<div class="col-sm-4 basic-info-item">
			<img class="logo-image" src="{{logo.fields.file.url}}">
		</div>
		<div class="col-sm-4 basic-info-item">
			<section class="info">
				<p class="short-description">{{shortDescription}}</p>
				<a href="/donate" class="btn btn-primary"><i class="icon icon-donate"></i> Donate</a>
				<p class="tax-deductibility-info">
					<a href="#">Tax deductibility info
						<i class="fa fa-globe"></i> 
					</a>
				</p>
			</section>
		</div>
		<div class="col-sm-4 basic-info-item">
			<section class="impact-summary">
				<ul class="charity-rating">
					<li>Room for more funding:<br><i class="fa fa-money"></i></li>
					<li>Organisational Strength:<br><i class="fa fa-money"></i><i class="fa fa-money"></i><i class="fa fa-money"></i></li>
					<li>Cause Importance:<br><i class="fa fa-money"></i><i class="fa fa-money"></i></li>
				</ul>
				<a href="/research/impact-summaries" class="learn-more">
					<i class="fa fa-question-circle"></i>
					<span class="sr-only">Learn More</span>
				</a>
			</section>
		</div>
	</div>
{% endblock %}

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