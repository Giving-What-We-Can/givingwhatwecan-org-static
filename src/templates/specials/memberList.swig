{% if stats.Pledgers %}
<div class="row">
	<ul class="member-list list-unstyled">
	{% for Pledger in stats.Pledgers %}
		<li class="col-sm-4 col-md-3">
			<div class="member-details">
				<h4 id="{{Pledger.fullName|slug}}" class="member-name">
					{{Pledger.fullName}}
				</h4>
				<p>{{ moment(Pledger.pledgeStart, 'YYYY-MM-DD').format('MMMM YYYY') }}</p>
			<div>
		</li>
	{% endfor %}
	</ul>
</div>
{% endif %}
