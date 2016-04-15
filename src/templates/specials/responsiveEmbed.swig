<figure>
	<div class="embed-responsive embed-responsive-{{embedAspectRatio|default('4by3')}}">
		<iframe class="embed-responsive-item" src="{{embedSrc}}"></iframe>
	</div>
	{% if embedCaption %}
	<figcaption>{{embedCaption}}</figcaption>
	{% endif %}
</figure>