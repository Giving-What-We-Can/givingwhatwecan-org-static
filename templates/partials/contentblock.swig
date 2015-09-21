<div class="content-block-wrapper {{contentblock.verticalSize}} {{contentblock.slug}} {{contentblock.page}}" {% if contentblock.backgroundImage %}style="background-image:url('{{contentblock.backgroundImage}}')"{% endif %}>
	<div class="content-block">
		<div class="{{ contentblock.horizontalSize }}">
			<div class="row content-block-content">
				{% autoescape false %}{{ contentblock.contents }}{% endautoescape %}
			</div>
		</div>
	</div>
</div>