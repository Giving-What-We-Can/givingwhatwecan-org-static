{% extends './layout.swig' %}

{% block title %}{{title}} - the {{ siteInfo.title}} Blog{% endblock %}

{% block content %}

	<div class="container">
		<div class="row">
			<article class="post">
				<header class="post-header">
					<p class="post-author">by
					{% for a in author %}
						<strong>{{ a.fields.title }}</strong>
					{% endfor %}
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