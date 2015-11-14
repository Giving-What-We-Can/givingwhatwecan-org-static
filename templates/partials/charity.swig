<div class="charity {{slug|escape}}" id="{{slug|escape}}">
	<div class="charity-header" {% if featuredImage && featuredImage.fields %}style="background-image:url({{featuredImage.fields.file.url}}?w=800)"{% endif %}>
		<div class="logo-wrapper">
			<div class="logo">
				<img class="logo-image" src="{{logo.fields.file.url}}?h=100" alt="{{title|escape}} logo">
			</div>
		</div>
		<div class="charity-name-wrapper">
			<h3 class="charity-name">{{title}}</h3>
		</div>
	</div>
	{% if shortDescription && shortDescription.length > 0 %}
		<div class="short-description-wrapper">
			<div class="short-description">
				<p>{{shortDescription}}</p>
			</div>
		</div>
	{% endif %}

	{% if fastFacts && fastFacts.length > 0 %}
		{% set facts = fastFacts.split("- ") %}
		{% if facts.length >= 2 %}
			{% set facts = facts.slice(1) %}
			<div class="fast-facts-wrapper">
				<ul class="fast-facts">
				{% for fact in facts %}
					<li class="fact">{{fact}}</li>
				{% endfor %}
				</ul>
			</div>
		{% endif %}
	{% endif %}

	<div class="actions">
		<div class="row">
			{% if page && page.fields %}
				<div class="col-md-6 action">
					<a href="/top-charities/{{page.fields.slug}}" class="btn btn-default">Learn more</a>
				</div>
			{% endif %}
				<div class="col-md-6 action">
					<a href="/get-involved/how-to-donate" class="btn btn-primary">Donate Now</a>
				</div>
		</div>
	</div>
</div>