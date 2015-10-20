<ul class="pagination">


	{% if pagination.num > 1 %}
		<li class="first">
			<a href="{{ relative(pagination.pages[0].path) }}" aria-label="First">
				<span aria-hidden="true">
					<i class="fa fa-angle-double-left"></i>
				</span>
			</a>
		</li>
	{% endif %}
	{% if pagination.previous %}
		<li class="previous">
			<a href="{{ relative(pagination.previous.path) }}" aria-label="Previous">
				<span aria-hidden="true">
					<i class="fa fa-angle-left"></i>
				</span>
			</a>
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
			<li class="page-number{% if page.pagination.num === pagination.num %} active{% endif %}" aria-label="Page {{ page.pagination.num }}">
				<a href="{{ relative(page.path) }}">
					<span aria-hidden="true">
						{{ page.pagination.num }}
					</span>
				</a>
			</li>
		{% endfor %}
	{% endif %}
	{% if pagination.next %}
		<li class="next">
			<a href="{{ relative(pagination.next.path) }}" aria-label="Next">
				<span aria-hidden="true">
					<i class="fa fa-angle-right"></i>
				</span>
			</a>
		</li>
	{% endif %}
	{% if pagination.num < pagination.pages.length %}
		<li class="last">
			<a href="{{ relative(pagination.pages[pagination.pages.length-1].path) }}" aria-label="Last">
				<span aria-hidden="true">
					<i class="fa fa-angle-double-right"></i>
				</span>
			</a>
		</li>
	{% endif %}
</ul>