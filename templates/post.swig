{% extends './layout.swig' %}

{% block title %}{{title}} - the {{ siteInfo.title}} Blog{% endblock %}

{% block content %}

	<div class="container">
		<div class="row">
			<article class="post">
				<header class="post-header">
					<h2 class="post-title title">{{ title }}</h2>
					<p class="post-author">by
					{% for a in author %}
						<strong>{{ a.fields.name }}</strong>
					{% endfor %}
					</p>
				</header>
				<section class="post-content">
					{{ contents }}
				</section>
			</article>
		</div>
		<hr>
		<p><!-- POST FOOTER --></p>
	</div>

{% endblock %}