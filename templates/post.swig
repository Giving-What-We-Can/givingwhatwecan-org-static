{% extends './layout.swig' %}

{% block title %}{{title}} - the {{ siteInfo.title}} Blog{% endblock %}

{% block content %}
	

	<div class="container">
		<div class="row">
			<article class="post">
				<header class="post-header">
					<p class="post-author">by
					{% for a in author %}{% if !loop.last && loop.index !== 1%}, {% endif %}{% if loop.last && loop.index !== 1%} &amp; {% endif %}<a href="/person/{{a.fields.slug}}" class="author-name">{{ a.fields.title }}</a>{% endfor %}
					</p>
				</header>
				<section class="post-content">
					{{ contents }}
				</section>
				{% for a in author %}
					{% include './partials/authorinfo.swig' with a only%}		
				{% endfor %}
			</article>
		</div>
		<hr>
		<p><!-- POST FOOTER --></p>
	</div>

{% endblock %}