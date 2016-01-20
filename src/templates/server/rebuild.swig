{% set title = "Rebuild Giving What We Can" %}

{% extends '../layout.swig' %}

{% block content %}
<div class="container">
	<div class="row">
		{% if response.statusCode !== 200 %}
		<div class="col-xs-12">
			<h3>Error rebuilding the site:</h3>
			<pre>
Status Code: {{response.statusCode}}
Headers:
{{response.headers|json(4)}}
</pre>
		<p>Please copy and paste the box above into an email and send it to communications@givingwhatwecan.org</p>
		</div>
		{% else %}
		<div class="col-xs-12">
			<h3>Site rebuilding!</h3>
			<p>Please wait 1-2 minutes for the site to rebuild.</p>
			<p><strong>There is a limit of 100 rebuilds per month. Please remember to only rebuild the site after you are 100% happy with your content, and you have checked it using the <a href="/">preview</a> feature.</strong></p>
		</div>
		{% endif %}
	</div>
</div>
{% endblock %}