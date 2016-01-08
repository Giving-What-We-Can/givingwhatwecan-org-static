{% set ogImage = siteInfo.protocol + siteInfo.domain + '/images/layout/og-image-blog-default.jpg' %}
{% extends './layout.swig' %}

{% block head %}
<link rel="alternate" type="application/rss+xml" title="feed one" href="/blog.xml"/>
{% endblock %}


{% block banner %}
	{% set featuredImageURL = "https://images.contentful.com/yglmadi73s3x/3pZKzY335mUg8wAaSmUUsC/9cd1a2df1f89a9c5beca0629d0ca1e8f/AMF_Net_Distribution.JPG" %}
	{% set featuredImageDescription = "Workers distributing mosquito nets on behalf of the Against Malaria Foundation in Malawi (Against Malaria Foundation / againstmalaria.org)" %}
	{% parent %}
{% endblock %}

{% block content %}

	<div class="container">
		{% for post in pagination.files %}
			<div class="row">
				<article class="post">
					<a href="{{ relative(post.path) }}">
					<header class="post-header{% if post.featuredImage %} featured-image{% endif %}" {% if post.featuredImage %}style="background-image:url({{post.featuredImage.fields.file.url}})"{% endif %}>
						<h3 class="post-title title">{{ post.title }}</h3>
					</header>
					</a>
					{% include './partials/postDetails.swig' with post only %}
					<div class="row">
						<section class="post-excerpt col-md-9">
								<p class="excerpt">{{ post.excerpt }}</p>
						</section>
						<div class="col-md-3">
							<section class="post-read-more">
								<a class="btn btn-default pull-right" href="{{ relative(post.path) }}">
									Read more <i class="fa fa-arrow-right"></i>
								</a>
							</section>
						</div>
					</div>
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