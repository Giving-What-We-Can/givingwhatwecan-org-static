{% extends '../collection.swig' %}

{% block collectionItems %}
	<div class="row">
	{% for post in pagination.files %}
	<div class="col-sm-6">
		<a href="/{{post.path}}">
			<article class="charity collection-item {{post.recommendationLevel}}{% if post.featuredImage %} featured-image{% endif %}" {% if post.featuredImage %}style="background-image:url({{post.featuredImage.fields.file.url}})"{% endif %}>
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