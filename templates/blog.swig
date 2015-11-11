{% extends './layout.swig' %}

{% block head %}
<link rel="alternate" type="application/rss+xml" title="feed one" href="/blog.xml"/>
{% endblock %}


{% block content %}

	<div class="container">
		{% for post in pagination.files %}
			<div class="row">
				<article class="post">
					<header class="post-header">
						<a href="{{ relative(post.path) }}">
							<h3 class="post-title title">{{ post.title }}</h3>
						</a>
						<p class="post-author">by 
						{% for author in post.author %}
							<strong>{{ author.fields.title }}</strong>
						{% endfor %}
						</p>
					</header>
					<section class="post-excerpt">
						<p class="excerpt">{{ post.excerpt }}</p>
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
	</div>

{% endblock %}

{% block scripts %}


{% endblock %}