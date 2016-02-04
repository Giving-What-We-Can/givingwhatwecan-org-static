{% extends './layout.swig' %}

{% block title %}{{title}} - the {{ siteInfo.title}} Blog{% endblock %}

{% block content %}
	

	<div class="container">
		<div class="row">
			<div class="text-content">
				<article class="post">
					{% include './partials/postDetails.swig' %}
					<section class="post-content">
						{{ contents }}
						{% include './partials/share-button.swig' %}
					</section>
					{% for a in author %}
						{% include './partials/authorinfo.swig' with a only%}		
					{% endfor %}
					<section class="comments">
					{% include './partials/disqus.swig' %}
					</section>
				</article>
			</div>
		</div>
		<hr>
		<p><!-- POST FOOTER --></p>
	</div>
	<script>
	// push footnotes below article content
	loadScript(function(){
		var $ = window.jQuery;
		$(document).ready(function(){
			$('.footnotes-sep').appendTo('article.post');
			$('.footnotes').appendTo('article.post');
		})
	})
	</script>

{% endblock %}