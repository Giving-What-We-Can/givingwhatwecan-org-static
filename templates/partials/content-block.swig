<div class="content-block-wrapper {% for c in contentBlock.displayOptions %}{{c}} {% endfor %}{{contentBlockSet}}" id="{{contentBlock.slug}}"
    {% if contentBlock.backgroundImage %}style="background-image:url('{{contentBlock.backgroundImage.fields.file.url}}?w=1920')"{% endif %} >
	<div class="content-block">
		<div class="{{ contentBlock.horizontalSize|default('container-fluid') }}">
			<div class="content-block-content">
				{{ contentBlock.contents }}
			</div>
		</div>
	</div>
</div>