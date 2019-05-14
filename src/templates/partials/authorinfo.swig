<div class="quotation-author media">
	<div class="media-left">
		<img class="media-object quotation-author-photo" src="{{fields.photo.fields.file.url}}">
	</div>
	<div class="media-body">
		<h4 class="media-heading author-name">&mdash; {{fields.title}}{% if fields.position %} <small class="author-position">{{fields.position }}</small>{% endif %}</h4>

		<p class="author-short-bio">{{fields.shortBio|default(fields.contents|truncate(200)) }}</p>
	</div>
</div>
