{% extends '../collection.swig' %}

{% block collectionItems %}
	<div class="row">
	{% for post in pagination.files %}
	{% if !lastRecommendationLevel || post.recommendationLevel !== lastRecommendationLevel %}
		<div class="col-xs-12">
			<h2 class="recommendation-level-heading">
				{% if post.recommendationLevel === 1 %}
				Established Top Charities
				{% elif post.recommendationLevel === 2 %}
				Promising Top Charities
				{% elif post.recommendationLevel === 3 %}
				Highly Effective Charities
				{% elif post.recommendationLevel > 3 %}
				Other Charities
				{% endif %}
			</h2>
		</div>
	{% endif %}
	{% set lastRecommendationLevel = post.recommendationLevel %}
	<div class="col-sm-6">
		<a href="/{{post.path}}">
			<article class="charity collection-item {% if post.featuredImage %} featured-image{% endif %}" {% if post.featuredImage %}style="background-image:url({{post.featuredImage.fields.file.url}})"{% endif %}>
				<h3 class="title">{{post.title}}</h3>
				<div class="logo">
					<img src="{{post.logo.fields.file.url}}?w=100">
				</div>
			</article>
		</a>
	</div>
	{% endfor %}
	</div>
{% endblock %}