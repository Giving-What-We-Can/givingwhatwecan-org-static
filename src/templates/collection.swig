{% extends './page.swig' %}

{% block head %}
<link rel="alternate" type="application/rss+xml" title="feed one" href="/{{slug}}.xml"/>
{% endblock %}

{% block content %}


	<div class="container">
		<div class="row">
			<div class="text-content">
				<div class="page-content">
					{{contents}}
					<hr>
				</div>
			</div>
		</div>

		<div class="collection-items">
		{% block collectionItems %}{% endblock %}
		</div>
		
	</div>

	{% if pagination.pages.length > 1%}
	<div class="container">
		<div class="row">
			<nav class="blog-navigation col-xs-12">
				{% include './partials/pagination.swig' %}
			</nav>
		</div>
	</div>
	{% endif %}

{% endblock %}