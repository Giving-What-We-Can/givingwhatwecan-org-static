{% extends '../collection.swig' %}

{% block collectionItems %}

	{% for post in pagination.files %}
		<div class="row">
			<div class="text-content">
				<article class="post collection-item">
					<a href="{{ relative(post.path) }}">
					<header class="post-header{% if post.featuredImage %} featured-image{% endif %}" {% if post.featuredImage %}style="background-image:url({{post.featuredImage.fields.file.url}})"{% endif %}>
						<h3 class="post-title title">{{ post.title }}</h3>
					</header>
					</a>
					{% include './postDetails.swig' with post only %}
					<p class="excerpt">{{ post.excerpt }}</p>
					<a class="read-more-link" href="/{{ post.path }}">
						Read more <i class="fa fa-arrow-right"></i>
					</a>
				</article>
			</div>
		</div>
	{% endfor %}
{% endblock %}