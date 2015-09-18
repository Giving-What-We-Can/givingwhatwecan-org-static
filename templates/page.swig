{% extends './layout.swig' %}



{% block content %}

	<div class="container">
		<div class="row">
			<div class="page">
				<section class="page-content">
					{% autoescape false %}{{ contents }}{% endautoescape %}
				</section>
			</div>
		</div>
	</div>

{% endblock %}