{% if headings %}
	<ul class="toc">
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
	</ul>
{% else %}
<h3>No headings!</h3>
{% endif %}

