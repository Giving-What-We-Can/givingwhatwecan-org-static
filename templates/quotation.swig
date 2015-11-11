{% extends './layout.swig' %}



{% block banner %}
	{% set featuredImageURL = "//images.contentful.com/yglmadi73s3x/728o0vLiw0SIYCSWmOKSEo/e3421c41219c123458f34634fdd845eb/shutterstock_293867711.jpg" %}
	{% include "./partials/banner.swig" %}
{% endblock %}

{% block content %}

	<div class="container">
		<div class="row">
			<div class="page">
				<section class="quotation-content">
					{% include './partials/quotation-block.swig' %}
				</section>
			</div>
		</div>
	</div>

{% endblock %}