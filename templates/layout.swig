<!DOCTYPE html>
<html class="no-js">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	{% if slug === '/' %}{% set title = siteInfo.title %}{% endif %}
	<title>{% block title %}{{ title }}{% endblock head %}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	{% set canonicalURL = siteInfo.protocol + siteInfo.domain + '/' + path %}
	<link rel="canonical" href="{{canonicalURL}}" />
	{% if !description %}
	{% set description = siteInfo.description %}
	{% endif %}
	<meta name="description" content="{{description}}">
	<link rel="stylesheet" type="text/css" href="{{ relative('/styles/app.min.css') }}">
	{% include './partials/og-images.swig' %}
	{% include './partials/favicons.swig' %}
	<script>document.documentElement.className = document.documentElement.className.replace('no-js','js');</script>
	{% block head %}
	{% endblock %}

</head>

<body class="collection-{{ collection }} {% if collections[collection] && collections[collection].metadata && collections[collection].metadata.singular  %} {{ collections[collection].metadata.singular }} {% endif %}{{ {true:'home', false:slug}[slug==='/'] }}">


{% include "./partials/nav.swig" %}


	{% block banner %}
	{% endblock %}
	
	<div id="wrapper">
		<div class="content">
			<!--[if lt IE 10]>
			<p class="browsehappy">You are using an <strong>outdated</strong> browser. Some elements of this website may display incorrectly or not work as intended.<br>
			Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
			<![endif]-->
			<div class="container noscript">
				<div class="alert alert-warning">
					<p> <i class="fa fa-warning"></i> You do not have Javascript enabled. Some elements
						of this website may not work&nbsp;correctly.</p>
				</div>
			</div>
			{% block content %}
			{% endblock %}
		</div>
		<footer class="footer">
			{% block footer %}
				{% include './partials/footer.swig' %}
			{% endblock %}
		</footer>
	</div>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js"></script>
	<script>
		WebFont.load({
		    google: {
		      families: ['Source+Sans+Pro:400,300,700:latin']
		    },
		    active: function() {
		    	$(function(){
			    	$(document).trigger('WebFont','active')
			    });
		    }
  		});
	</script>
	<!--<script src="{{ relative('/scripts/init.min.js') }}"></script>-->
	<!--[if lt IE 9]>
    <script src="{{ relative('/scripts/ltie9.min.js') }}"></script>
	<![endif]-->
	<script src="{{ relative('/scripts/app.min.js') }}"></script>
	{% block scripts %}{% endblock %}
</body>

</html>