<div class="row basic-info">
	{# Charity basic info — website, donate link etc #}
	{% if collection|contains('_charities') %}
	<div class="basic-info-item">
		<section class="info">
			<img class="logo-image" src="{{logo.fields.file.url}}">
			<p class="short-description">{{shortDescription}}</p>
			{% if website %}
			<p class="website">
				<a href="{{website}}" target="_blank"><i class="fa fa-home"></i> Website
			</p>
			{% endif %}
		</section>
	</div>

	<div class="basic-info-item">
		<section class="details">
			{% set recommendationHeadings = [
												'',
												'Established Top Charity',
												'Promising Top Charity',
												'Highly Effective Charity',
												'',
												'Effective in Cause Area',
												'',
												'Other Charity',
												'',
												'',
												'Not recommended'
											]
			%}
			{% if recommendationLevel %}
				
					<span class="recommendation-level recommendation-level-{{recommendationLevel}}">
						<h4 class="recommendation-level-heading">Rating</h4>
						<h5>{{recommendationHeadings[recommendationLevel]}}</h5>
						<p class="recommendation-level-summary">
						{% if recommendationLevel <=2 %}
							<strong>{{title}}</strong> is one of our <a href="/top-charities">Top Charities</a>. Your donation to {{title}} is likely to have a high impact.
						{% elif recommendationLevel === 3 %}
							We don't believe <strong>{{title}}</strong> is as effective as any of our <a href="/top-charities">Top Charities</a>, however we think that they are likely to be more effective than most other charities.
						{% elif recommendationLevel === 5 %}
							We don't believe <strong>{{title}}</strong> is as effective as our <a href="/top-charities">Top Charities</a>. We think donors should try to remain <a href="/cause-neutrality">cause neutral</a>, but {{title}} is likely to be one of the best options for donors who have a strong preference  supporting work on <a href="/cause/{{causes[0].fields.slug}}">{{causes[0].fields.title}}</a>.
						{% else %}
							<strong>{{title}}</strong> is not one of our recommended charities. You should read our report below for further information.
						{% endif %}
						</p>
					</span>

				{% if recommendationLevel <=3 %}
				<a href="/donate" class="btn btn-primary donate-link"><i class="icon icon-donate"></i> Donate Now</a>
				{% endif %}
			{% endif %}

		</section>
	</div>


	{% endif %}
	

	{# Main Impact Summary for causes and charities #}
	{% if collection|contains('_charities') || collection|contains('_causes') %}
	<div class="basic-info-item">
		<section class="impact-summary">
			<h4>Impact Summary</h4>
			{% include './impact-summary.swig' %}
			<a href="/research/impact-summaries" class="learn-more">
				<i class="fa fa-question-circle"></i>
				<span class="sr-only">Learn More</span>
			</a>
		</section>
	</div>
	{% endif %}

	{# Additional Impact Summary for charity cause #}
	{% if collection|contains('_charities') && causes[0] %}
	<div class="basic-info-item">
		<section class="impact-summary">
			<h4>Cause Impact</h4>
			{% include './impact-summary.swig' with causes[0].fields only %}
			<a href="/research/impact-summaries" class="learn-more">
				<i class="fa fa-question-circle"></i>
				<span class="sr-only">Learn More</span>
			</a>
			<a class="cause-link" href="/cause/{{causes[0].fields.slug}}">
				<i class="fa fa-heartbeat"></i>
				{{causes[0].fields.title}}
				<i class="fa fa-arrow-right"></i>
			</a>
		</section>
	</div>
	{% endif %}
	{# Additional Impact Summary for cause charities #}
	{% if collection|contains('_causes') %}
		{% for charity in _charities %}
			{% set inc = false %}
			{% for cause in charity.causes %}
				{% if cause.sys.id === id && loop.index<=3 %}
					{% set inc = true %}
				{% endif %}
			{% endfor %}
			{% if inc %}
			<div class="basic-info-item">
				<section class="impact-summary">
					<h4>Charity Impact</h4>
					{% include './impact-summary.swig' with charity only %}
					<a href="/research/impact-summaries" class="learn-more">
						<i class="fa fa-question-circle"></i>
						<span class="sr-only">Learn More</span>
					</a>
					<a class="charity-link" href="/charity/{{charity.slug}}">
						<img src="{{charity.logo.fields.file.url}}?w=90">
						{{charity.title}}
						<i class="fa fa-arrow-right"></i>
					</a>
				</section>
			</div>
			{% endif %}
		{% endfor %}
	{% endif %}


</div>