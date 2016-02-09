<!DOCTYPE html>
<html class="no-js">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	{% if slug === '/' %}{% set title = siteInfo.title %}{% endif %}
	<title>{% block title %}{{ title|default(siteInfo.title)|escape }}{% endblock head %}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	{% if slug === '/' %}
		{% set canonicalURL = siteInfo.protocol + siteInfo.domain + '/' %}
	{% else %}
		{% set canonicalURL = siteInfo.protocol + siteInfo.domain + '/' + path + '/'  %}
	{% endif %}
	<link rel="canonical" href="{{canonicalURL|escape}}" />
	{% set description = excerpt|default(siteInfo.description) %}
	<meta name="description" content="{{description|escape}}">
	<link rel="stylesheet" type="text/css" href="/styles/app.min.css">
	{% include './partials/og-images.swig' %}
	{% include './partials/favicons.swig' %}
	{% include './partials/json-schema.swig' %}
	<script>
		// fast pre-rendering check for javascript capability without requiring Modernizr in the head
		document.documentElement.className = document.documentElement.className.replace('no-js','js');
		// hide text while webfonts load, but unhide after three seconds if they haven't loaded yet
		document.documentElement.className += " wf-loading";
		window.wfl = setTimeout(function(){document.documentElement.className += ' wf-inactive';},3000)
		// defer execution of jquery-dependent scripts defined before jQuery loads
		window.q=[];window.$=function(f){q.push(f)}
		// enqueue scripts at the end of the page from before the closing body tag
		window.d=[];window.loadScript=function(path){d.push(path)}
		
	</script>
	{% block head %}
	{% endblock %}

</head>
<body class="{% if collections[collection] && collections[collection].metadata && collections[collection].metadata.singular  %} {{ collections[collection].metadata.singular }} {% endif %}{{ {true:'home', false:slug}[slug==='/'] }}">

{% include "./partials/nav.swig" %}


	{% block banner %}
		{% include './partials/banner.swig' %}
	{% endblock %}
	
	<div id="wrapper">
		<div class="content">

			<div class="container">
				<div class="row">
						<!--[if lt IE 10]>
						<div class="col-xs-12">
							<div class="alert alert-warning">
								<p class="browsehappy"><i class="fa fa-warning"></i> You are using an <strong>outdated</strong> browser. Some elements of this website may display incorrectly or not work as intended.</p>
								<p>Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
							</div>
						</div>
						<![endif]-->
						<div class="noscript">
							<div class="col-xs-12">
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
		</div>
		<footer class="footer">
			{% block footer %}
				{% include './partials/footer.swig' %}
			{% endblock %}
		</footer>
	</div>
	<script src="/scripts/includes/LAB.min.js"></script>
	<script>
		window.$LAB = window.$LAB || undefined;
		(function($LAB){
			if(!$LAB) return;
			// labjs script loader
			$LAB
			.queueScript("https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js")
			.queueScript("https://cdn.optimizely.com/js/3479250027.js")
			.queueWait(function(){
				// kill optimizely if it hasn't loaded within a second
				function optimizelyTimeout() {
				    window.optimizely = window.optimizely|| [];
				    if (!window.optimizely.data) {
				    	window.optimizely.push("timeout");
				    }
				}
				setTimeout(optimizelyTimeout, 2000);
			})
			.queueScript("https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js")
			.queueWait(function(){
				function webfontStatus(status){
					(function($){
						if (status){
							$(function(){
								$(document).trigger('WebFont',status)
							})
						}
					})(jQuery)
				}
				WebFont.load({
					google: {
						families: ['Source+Sans+Pro:200,200italic,400,400italic,700,700italic:latin']
					},
					loading: function(){
						clearTimeout(window.wfl);
						webfontStatus('loading');
					},
					active: function() {
						webfontStatus('active');
					},
					inactive: function() {
						webfontStatus('inactive');
					}
				});
			})
			.queueScript('/scripts/app.min.js')
			.queueScript('https://cdn.segment.com/analytics.js/v1/VtTlzxOC5QJ1H0zermvo84cAbReTofDU/analytics.min.js')
			.queueWait(function(){
				var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.SNIPPET_VERSION="3.1.0";
				analytics.page()
			})
			;
			// enqueue anything that's been requested with loadScript() elsewhere in the body
			var s;
			for (var i = 0; i < d.length; i++) {
				if(typeof d[i] === 'function'){
					$LAB.queueWait(d[i])
				} else {
					s = d[i].substr(d[i].length-4) === '.js' || d[i].substr(0,4) === "http" ? d[i] : '/scripts/includes/'+d[i]+'.min.js';
					$LAB.queueScript(s)
				}
			};
			$LAB.runQueue();
		})(window.$LAB)
	</script>
	<script>
		// deferred execution for jquery-dependent scripts defined earlier in the body
	</script>

</body>

</html>