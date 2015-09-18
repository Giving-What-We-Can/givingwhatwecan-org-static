<ul class="pagination">


	{% if pagination.num > 1 %}
		<li class="first">
			<span aria-hidden="true">
				<a href="{{ relative(pagination.pages[0].path) }}">
					<i class="fa fa-angle-double-left"></i>
				</a>
			</span>
		</li>
	{% endif %}
	{% if pagination.previous %}
		<li class="previous">
			<span aria-hidden="true">
				<a href="{{ relative(pagination.previous.path) }}">
					<i class="fa fa-angle-left"></i>
				</a>
			</span>
		</li>
	{% endif %}
	{% if pagination.pages %}
		{% set  paginationLength = paginationLength || 5 %}
		{% set  distance = Math.floor(paginationLength/2) %}
		{% if pagination.num > distance %}
			{% set start = pagination.num - 1 - distance %}
		{% else %}
			{% set start = 0 %}
		{% endif %}
		{% if start + paginationLength < pagination.pages.length %}
			{% set end = start + paginationLength %}
		{% else %}
			{% set end = pagination.pages.length %}
		{% endif %}
		{% if end - start < paginationLength %}
			{% set start = end - paginationLength %}
		{% endif %}
		{% for page in pagination.pages.slice(start,end) %}
			<li class="page-number{% if page.pagination.num === pagination.num %} active{% endif %}">
				<span aria-hidden="true">
					<a href="{{ relative(page.path) }}">
						{{ page.pagination.num }}
					</a>
				</span>
			</li>
		{% endfor %}
	{% endif %}
	{% if pagination.next %}
		<li class="next">
			<span aria-hidden="true">
				<a href="{{ relative(pagination.next.path) }}">
					<i class="fa fa-angle-right"></i>
				</a>
			</span>
		</li>
	{% endif %}
	{% if pagination.num < pagination.pages.length %}
		<li class="last">
			<span aria-hidden="true">
				<a href="{{ relative(pagination.pages[pagination.pages.length-1].path) }}">
					<i class="fa fa-angle-double-right"></i>
				</a>
			</span>
		</li>
	{% endif %}
</ul>