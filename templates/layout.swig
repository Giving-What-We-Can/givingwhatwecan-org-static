<!DOCTYPE html>
<html class="no-js">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	{% if slug === '/' %}{% set title = siteInfo.title %}{% endif %}
	<title>{% block title %}{{ title|default(siteInfo.title) }}{% endblock head %}</title>
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
	<script>
		// fast pre-rendering check for javascript capability without requiring Modernizr in the head
		document.documentElement.className = document.documentElement.className.replace('no-js','js');
		// defer execution of jquery-dependent scripts defined before jQuery loads
		window.q=[];window.$=function(f){q.push(f)}
		// enqueue scripts at the end of the page from before the closing body tag
		window.d=[];window.loadScript=function(path){d.push(path)}
		
	</script>
	{% block head %}
	{% endblock %}

</head>

<body class="collection-{{ collection }} {% if collections[collection] && collections[collection].metadata && collections[collection].metadata.singular  %} {{ collections[collection].metadata.singular }} {% endif %}{{ {true:'home', false:slug}[slug==='/'] }}">

{% include "./partials/nav.swig" %}


	{% block banner %}
		{% include './partials/banner.swig' %}
	{% endblock %}
	
	<div id="wrapper">
		<div class="content">

			<div class="container">
				<div class="row">
					<div class="col-xs-12">
						<!--[if lt IE 10]>
							<div class="alert alert-warning">
								<p class="browsehappy"><i class="fa fa-warning"></i> You are using an <strong>outdated</strong> browser. Some elements of this website may display incorrectly or not work as intended.</p>
								<p>Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
							</div>
						<![endif]-->
						<div class="noscript">
							<div class="alert alert-warning">
								<p> <i class="fa fa-warning"></i> You do not have Javascript enabled. Some elements
									of this website may not work&nbsp;correctly.</p>
							</div>
						</div>
					</div>
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

	<script src="/scripts/includes/LAB.min.js"></script>
	<script>
		// labjs script loader
		$LAB
		.queueScript("//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js")
		.queueScript("//ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js")
		.queueWait(function(){
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
		})
		.queueScript("/scripts/app.min.js")
		.queueWait(function(){
			$('.page-title').slabText();
		})
		;
		// enqueue anything that's been requested with loadScript() elsewhere in the body
		var s;
		for (var i = 0; i < d.length; i++) {
			if(typeof d[i] === 'function'){
				$LAB.queueWait(d[i])
			} else {
				s = d[i].substr(d[i].length-4) === '.js' ? d[i] : '/scripts/includes/'+d[i]+'.min.js';
				$LAB.queueScript(s)
			}
		};
		$LAB.runQueue();
	</script>
	<script>
		// deferred execution for jquery-dependent scripts defined earlier in the body
		$(function() {
			$.each(q, function(index, f) {
				f(jQuery);
			});
		});
	</script>

</body>

</html>