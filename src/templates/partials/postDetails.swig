<section class="post-details">
	<ul class="list-unstyled">
		<li class="post-author"><i class="fa fa-user"></i> By
			{% if author[0].fields %}
				{% for a in author %}
					{% if a.fields %}
						{% if !loop.last && loop.index !== 1%}, {% endif %}
						{% if loop.last && loop.index !== 1%} &amp; {% endif %}
						<a href="/person/{{a.fields.slug}}" class="author-name">{{ a.fields.title }}</a>
					{% endif %}
				{% endfor %}
			{% else %}
				Anonymous
			{% endif %}
		</li>
		{% set pattern = 'D MMM YYYY'%}
		{% set publishDate = date|moment(pattern)%}
		{% set updatedDate = updated|moment(pattern)%}
		<li class="published">
			<i class="fa fa-calendar"></i>
			<span class="sr-only">Published</span>
			{{publishDate}}
		</li>
		{% if publishDate !== updatedDate %}
		<li class="updated">
			<i class="fa fa-refresh"></i>
			<span class="sr-only">Updated</span>
			{{updatedDate}}
		</li>
		{% endif %}
	</ul>
</section>
