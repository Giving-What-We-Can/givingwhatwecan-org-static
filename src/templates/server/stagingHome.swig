{% set title = "Giving What We Can Preview Server" %}

{% extends '../layout.swig' %}

{% block content %}

	<div class="container">
		<div class="row">
			<div class="page">
				<section class="page-content">
					<p class="first-paragraph">This page will let you preview your content before you publish it in <a href="https://app.contentful.com" target="_blank">Contentful</a></p>
					<p>Use the following process to edit or create content in Contentful:</p>
					<ul>
						<li>Create or edit your content (e.g. a Page, Post, or Author)</li>
						<li>Don't press the 'Publish' button on the main content yet. (Your changes will be saved automatically, and you'll be able to preview through this website. <em>However</em>, if you're adding new Media (e.g. Images), you can press 'Publish' on them after you've added them to Contentful)</li>
						<li>Come to this website, choose the content type you just edited, and then click on the title of the content (it should be near the top of the list)</li>
						<li>Ensure everything looks good. If not, go back to Contentful, make your edits, then refresh the preview page (again, no need to push Publish just yet).</li>
						<li>Once you're happy with the edits, press 'Publish' to make them live</li>
						<li>Come back to this page, and click the 'Rebuild' button to rebuild the site!</li>
					</ul>
					<p>You should always preview the page you are editing <em>before</em> clicking 'Publish' in Contentful, and <em>before</em> clicking the 'Rebuild' button below. We only get 100 rebuilds every month, so it's best to make all your changes, preview them, then click 'Rebuild' once you're happy with them all.</p>
					<p>Any questions, email communications@givingwhatwecan.org</p>

					<hr>

					<h2>Choose a content type to preview:</h2>
					<ul>
					{% set allowedTypes = ['Page','Post','Person','Report','Cause','Charity']%}
					{% for contentType in contentTypes %}

						{% if allowedTypes.indexOf(contentType.name) > -1 %}
						<li><a href="/{{contentType.sys.id}}" class="">{{contentType.name}}</a></li>
						{% endif %}
					{% endfor %}
					</ul>

					<hr>

					<h2>Rebuild the site</h2>
					<p>If you have tested your content using the preview 
					<a href="/rebuild" class="btn btn-primary">Rebuild</a>
				</section>
			</div>
		</div>
	</div>
{% endblock %}