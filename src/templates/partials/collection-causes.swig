{% extends '../collection.swig' %}

{% block collectionItems %}
	<div class="row">
	{% for post in pagination.files %}
	{% if !lastPriority || lastPriority !== post.priority %}
	<div class="col-xs-12">
		<h2 class="priority-level-heading">
			{% if post.priority === 1 %}
			High Priority Causes
			{% elif post.priority === 5 %}
			Promising Causes
			{% elif post.priority > 5 %}
			Other Causes
			{% endif %}
		</h2>
	</div>
	{% endif %}
	{% set lastPriority = post.priority %}
	<div class="col-sm-6">
		<a href="/{{post.path}}">
			<article class="cause collection-item {{post.recommendationLevel}}{% if post.featuredImage %} featured-image{% endif %}" {% if post.featuredImage %}style="background-image:url({{post.featuredImage.fields.file.url}})"{% endif %}>
				<h3 class="title"><i class="fa fa-heartbeat"></i>  {{post.title}}</h3>
			</article>
		</a>
	</div>
	{% endfor %}
	</div>
{% endblock %}