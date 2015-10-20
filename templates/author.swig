{% extends './layout.swig' %}



{% block content %}
	<div class="container">
		<div class="row">
			<div class="author">
				<header class="author-header">
					<h2 class="author-name title">{{ name }}</h3>
				</header>
				<section class="author-content">
					{% autoescape false %}{{ contents }}{% endautoescape %}
				</section>
				<section class="author-posts">
					<!-- AUTHOR POSTS HERE -->
				</section>
			</div>
		</div>
		<hr>
	</div>
{% endblock %}