
<!DOCTYPE html>
<html class="no-js">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>{% block title %}{{ title }}{% endblock head %}</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" href="{{ relative('/styles/app.min.css') }}">
	
	{% include './partials/favicons.swig' %}

	<script src="{{ relative('/scripts/header.min.js') }}"></script>
	{% block head %}
	{% endblock %}

</head>

<body class="collection-{{ collection }} {% if collections[collection] && collections[collection].metadata && collections[collection].metadata.singular  %} {{ collections[collection].metadata.singular }} {% endif %}{{ {true:'home', false:slug}[slug==='/'] }}">


{% include "./partials/nav.swig" %}


	{% block banner %}
	{% endblock %}
	
	
	<div class="content">
		<!--[if lt IE 10]><p class="browsehappy"></p>You are using an <strong>outdated</strong> browser.
		Please <a href="http://browsehappy.com/">upgrade your browser</a>
		to improve your experience.
		<![endif]-->
		<noscript>
			<div class="container">
				<div class="alert alert-warning">
					<p> <i class="fa fa-warning"></i> You do not have Javascript enabled. Some elements
						of this website may not work&nbsp;correctly.</p>
				</div>
			</div>
		</noscript>
		{% block content %}
		{% endblock %}
	</div>

	<footer class="footer">
		{% block footer %}
			{% include './partials/footer.swig' %}
		{% endblock %}
	</footer>

	<script src="{{ relative('/scripts/app.min.js') }}"></script>
	{% block scripts %}
	{% endblock %}
</body>

</html>