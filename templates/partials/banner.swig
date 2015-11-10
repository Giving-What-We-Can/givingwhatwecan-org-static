<div id="banner"
	{% if featuredImage && featuredImage.fields %}
		class="banner-background" 
		style="background-image:url('{{featuredImage.fields.file.url}}')"
	{% endif %}
>
	<div class="header">
		<div class="container">
			<div class="row">
				<div class="col-sm-8 col-sm-offset-2">
					<h1 class="page-title"><span class="text-background">{{ title }}</span></h1></div>
			</div>
		</div>
	</div>
</div>