{% set title = "Preview " + contentTypeName + 's' %}

{% extends '../layout.swig' %}

{% block content %}
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<h3>{{contentTypeName}}s:</h3>
			<ul>
			{% for entry in entries %}
				<li><a href="/{{contentType}}/{{entry.sys.id}}">{{entry.fields.title}}</a></li>
			{% endfor %}
			</ul>
			<pre>{{entries|json(4)}}</pre>
		</div>
	</div>
</div>
{% endblock %}