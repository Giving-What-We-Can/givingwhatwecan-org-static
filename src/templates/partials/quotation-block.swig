<blockquote class="quotation">
	{{ contents }}
</blockquote>
<div class="quotation-author media">
	<div class="media-left">
		<img class="media-object quotation-author-photo" src="{{author.fields.photo.fields.file.url}}?h=100&amp;w=100&amp;fit=thumb&amp;f=face">
	</div>
	<div class="media-body">
		<h4 class="media-heading quotation-author-name">&mdash; {{author.fields.title}}</h4>
		<p class="quotation-author-short-bio">{{author.fields.shortBio|default(author.fields.contents|truncate(100)) }}</p>
	</div>
</div>
