{% extends './layout.swig' %}



{% block content %}
{# 
	<div class="container">
		{% for post in pagination.files %}
			<div class="row">
				<article class="post">
					<header class="post-header">
						<a href="{{ relative(post.path) }}">
							<h3 class="post-title title">{{ post.title }}</h3>
						</a>
						<p class="post-author">by {{ post.author }}</p>
					</header>
					<section class="post-excerpt">
						{% autoescape false %}{{ post.excerpt }}{% endautoescape %}
					</section>
				</article>
			</div>
			<hr>
		{% endfor %}
	</div>

	<div class="container">
		<div class="row">
			<nav class="blog-navigation col-xs-12">
				{% include './partials/pagination.swig' %}
			</nav>
		</div>
	</div> #}

{% endblock %}