{% if headings %}
<div class="row">
	<div class="toc col-xs-12">
		<h3 class="toc-header">Contents <small>{{title}}</small></h3>
		<ol class="toc-contents">
		{% set depth = tocDepth|default(3) %}
		{% set lastHeading = 2 %}
		{% set startDepth = lastHeading %}
		{% for heading in headings %}
			{% set currentHeading = parseInt(heading.tag.substr(1)) %}
			{% if lastHeading < currentHeading %}
			<ul class="toc-child">
			{% elif lastHeading > currentHeading %}
			</ul>
			{% endif %}
			{% if currentHeading <= depth %}
				<li class="level-{{heading.tag}}"><a href="#{{heading.id}}">{{heading.text}}</a></li>
			{% endif %}
			{% set lastHeading = currentHeading %}
		{% endfor %}
		{% if lastHeading > startDepth %}
			</ul>
		{% endif %}
		</ol>
	</div>
</div>
{% elif server %}
	<ul class="toc">
		<li class="level-2">Table of contents will appear here</li>
	</ul>
{% endif %}
