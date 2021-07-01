<!DOCTYPE html>
<html class="no-js">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>{% block title %}{{ pageTitle }}{% endblock head %}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	{% if slug === '/' %}
		{% set canonicalURL = siteInfo.protocol + siteInfo.domain + '/' %}
	{% else %}
		{% set canonicalURL = siteInfo.protocol + siteInfo.domain + '/' + path + '/'  %}
	{% endif %}
	<link rel="canonical" href="{{canonicalURL|escape}}" />
	<meta name="description" content="{{description|default(siteInfo.description)|escape}}">
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

		// For Segment Analytics
		window.WRITE_CODE = "VtTlzxOC5QJ1H0zermvo84cAbReTofDU"

	</script>
	{% block head %}
	{% endblock %}

</head>
{% set collectionSlug = "no-collection" %}
{% if collections[collection] && collections[collection].metadata && collections[collection].metadata.singular  %}
	{% set collectionSlug = collections[collection]['metadata']['singular'] %}
{% endif %}
<body class="{{collectionSlug}} {{ {true:'home', false:slug}[slug==='/'] }} template-{{template|replace('.swig','')|default('default')}}">

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
									<p> <i class="fa fa-exclamation-triangle"></i> You do not have Javascript enabled. Some elements
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
			.queueWait(function () {
				/*
				 * Segment Analytics Preload
				 * From: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/
				 * - used unminified on purpose as we need to integrate it with $LAB and keep things readable
				 */
				var analytics = window.analytics = window.analytics || [];
				// If the real analytics.js is already on the page return.
				if (analytics.initialize) return;
				// If the snippet was invoked already show an error.
				if (analytics.invoked) {
					if (window.console && console.error) {
					console.error('Segment snippet included twice.');
					}
					return;
				}
				// Invoked flag, to make sure the snippet
				// is never invoked twice.
				analytics.invoked = true;
				// A list of the methods in Analytics.js to stub.
				analytics.methods = [
					'trackSubmit',
					'trackClick',
					'trackLink',
					'trackForm',
					'pageview',
					'identify',
					'reset',
					'group',
					'track',
					'ready',
					'alias',
					'debug',
					'page',
					'once',
					'off',
					'on',
					'addSourceMiddleware',
					'addIntegrationMiddleware',
					'setAnonymousId',
					'addDestinationMiddleware'
				];
				// Define a factory to create stubs. These are placeholders
				// for methods in Analytics.js so that you never have to wait
				// for it to load to actually record data. The `method` is
				// stored as the first argument, so we can replay the data.
				analytics.factory = function(method){
					return function(){
					var args = Array.prototype.slice.call(arguments);
					args.unshift(method);
					analytics.push(args);
					return analytics;
					};
				};
				// For each of our methods, generate a queueing stub.
				for (var i = 0; i < analytics.methods.length; i++) {
					var key = analytics.methods[i];
					analytics[key] = analytics.factory(key);
				}

			})
			/* Segment Analytics load */
			.queueScript('https://cdn.segment.com/analytics.js/v1/'+ window.WRITE_CODE +'/analytics.min.js')
			.queueWait(function(){
				/*
				 * Segment Analytics postload
				 * Also copied from: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/
				 */
				// Segment actions
				analytics._writeKey = window.WRITE_CODE
				// Add a version to keep track of what's in the wild.
				analytics.SNIPPET_VERSION = '4.13.2';
				// Load Analytics.js with your key, which will automatically
				// load the tools you've enabled for your account. Boosh!
				analytics.load(window.WRITE_CODE);
				// Make the first page call to load the integrations.
				analytics.page();
				/* end copy */

				// Segment actions reliant on jQuery
				(function($){
					/*$("#mailchimp-signup-form").on('newsletter_signup',function(event,data){
						analytics.identify({
						  email: data.email,
						  firstName: data.firstName,
						  lastName: data.lastName
						});
						if(data.status==="success"){
							analytics.track("Signed up to Newsletter");
						}
					});

					$('.mailchimp-signup-modal').on('newsletter_modal_shown',function(event,data){
						analytics.track("Saw Newsletter popup")
					})*/

				})(jQuery);
			})
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

			$LAB
			.queueWait(function(){
				(function($){
					$(document).trigger('jsready');
				})(jQuery);
			})

			$LAB.runQueue();

		})(window.$LAB)
	</script>
</body>

</html>
