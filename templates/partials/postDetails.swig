<section class="post-details">
	<p><span class="post-author"><i class="fa fa-user"></i> By
		{% for a in author %}{% if !loop.last && loop.index !== 1%}, {% endif %}{% if loop.last && loop.index !== 1%} &amp; {% endif %}<a href="/person/{{a.fields.slug}}" class="author-name">{{ a.fields.title }}</a>{% endfor %}.
	</span>
	<br class="visible-xs">
	<span class="post-date">
		<i class="fa fa-calendar"></i> <span class="sr-only">Posted on the </span>{{date|moment('Do of MMMM, YYYY')}}
	</span></p>
</section>