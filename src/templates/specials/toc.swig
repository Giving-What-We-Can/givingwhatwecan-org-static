{% if headings %}
<div class="row">
	<div class="col-xs-12">
		<div class="toc">
			<h3 class="toc-header">Contents <small>{{title}}</small></h3>
			<ol class="toc-contents">
			{% set depth = tocDepth|default(3) %}
			{% set lastHeading = 2 %}
			{% set startDepth = lastHeading %}
			{% for heading in headings %}
				{% set currentHeading = parseInt(heading.tag.substr(1)) %}
				{% if currentHeading <= depth %}
					{% if lastHeading < currentHeading %}
					<ol class="toc-child">
					{% elif lastHeading > currentHeading %}
						{% set levels = [6,5,4,3,2] %}
						{% for level in levels %}
							{% if lastHeading > level && level >= currentHeading %}
							</ol>
							{% endif %}
						{% endfor %}
					{% else %}
					</li>
					{% endif %}
					<li class="level-{{heading.tag}}"><a href="#{{heading.id}}">{{heading.text}}</a>
					{% set lastHeading = currentHeading %}
				{% endif %}
			{% endfor %}
			{% if lastHeading > startDepth %}
				</ol>
			{% endif %}
			</ol>
		</div>
	</div>
</div>
{% elif server %}
	<ul class="toc">
		<li class="level-2">Table of contents will appear here</li>
	</ul>
{% else %}
<em>Error: could not render table of contents</em>
{% endif %}
