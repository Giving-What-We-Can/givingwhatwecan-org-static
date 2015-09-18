{% extends './layout.swig' %}

{% block title %}{{title}} - the {{ siteInfo.title}} Blog{% endblock %}

{% block content %}

	<div class="container">
		<div class="row">
			<article class="post">
				<header class="post-header">
					<h2 class="post-title title">{{ title }}</h2>
					<p class="post-author">by {{ author }}</p>
				</header>
				<section class="post-content">
					{% autoescape false %}{{ contents }}{% endautoescape %}
				</section>
			</article>
		</div>
		<hr>
		<p><!-- POST FOOTER --></p>
	</div>

{% endblock %}