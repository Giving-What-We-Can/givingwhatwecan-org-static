{% extends '../collection.swig' %}

{% block collectionItems %}
	{% for post in pagination.files %}
	<div class="row">
		<div class="col-md-8 col-md-offset-2">
				<article class="report collection-item">
					<h3 class="title"><i class="fa fa-file-text-o"></i> <a href="/{{post.path}}">{{post.title}}</a></h3>
					{% include './postDetails.swig' with post only %}
					<p class="excerpt">{{post.excerpt}}</p>
					<a class="read-more-link" href="/{{post.path}}">Read more <i class="fa fa-arrow-right"></i></a>
				</article>
		</div>
	</div>
	{% endfor %}
{% endblock %}