{% set includes = {
	backgroundImage: true,
	description:true,
	fastFacts:true,
	actions:true,
	actionsLearnMore:true,
	actionsWebsite: true,
	actionsDonate: true,
	actionsDirectDonate: false
} 
%}

{% if display === 'donate-page' %}
	{% set includes.fastFacts = false %}
	{% set includes.actionsLearnMore = false %}
	{% set includes.actionsDonate = false %}
	{% set includes.actionsDirectDonate = true %}
	{% set includes.actionsLearnMore = true %}
	{% set includes.actionsWebsite = false %}
{% endif %}

<div class="charity {{charity.slug|escape}} {{display}} {% if includes.backgroundImage %}background-image{% endif %}" id="{{charity.slug|escape}}">
	<div class="charity-header" {% if includes.backgroundImage && charity.featuredImage && charity.featuredImage.fields %}style="background-image:url({{charity.featuredImage.fields.file.url}}?w=800)"{% endif %}>
		<div class="logo-wrapper">
			<div class="logo">
				<img class="logo-image" src="{{charity.logo.fields.file.url}}?h=100" alt="{{charity.title|escape}} logo">
			</div>
		</div>
		<div class="charity-name-wrapper">
			<h3 class="charity-name">{{charity.title}}</h3>
		</div>
	</div>
	{% if includes.description && charity.shortDescription && charity.shortDescription.length > 0 %}
		<div class="short-description-wrapper">
			<div class="short-description">
				<p>{{charity.shortDescription}}</p>
			</div>
		</div>
	{% endif %}

	{% if includes.fastFacts && charity.fastFacts && charity.fastFacts.length > 0 %}
		{% set facts = charity.fastFacts.split("- ") %}
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

	{% if includes.actions %}
	<div class="actions">
		<div class="row">
				<div class="col-sm-6 action">
					{% if includes.actionsDonate %}
					<a href="/donate" class="btn btn-primary donate"><i class="icon icon-donate"></i> Donate Now</a>
					{% endif %}
					{% if includes.actionsDirectDonate %}
					<a href="{{charity.donationLink}}" target="_blank" class="btn btn-primary donate direct-donate"><i class="icon icon-donate"></i> Donate Now</a>
					{% endif %}
				</div>
				<div class="col-sm-6 action">
					{% if includes.actionsLearnMore %}
					<a href="/charity/{{charity.slug}}" class="btn btn-default learn-more">Learn more</a>
					{% endif %}
					{% if includes.actionsWebsite %}
					<a href="{{charity.contact[0]}}" target="_blank" class="btn btn-default website"><i class="fa fa-globe"></i> Website</a>
					{% endif %}
				</div>
		</div>
	</div>
	{% endif %}
</div>