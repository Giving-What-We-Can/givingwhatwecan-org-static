{% if stats.Pledgers %}
<div class="row">
	<ul class="member-list list-unstyled">
	{% for Pledger in stats.Pledgers %}
		{% set isActive = true %}
		{% if Pledger.pledgeEnd !== 'infinity' %}
			{% set isActive = false %}
		{% elseif moment(Pledger.pledgeEnd, 'YYYY-MM-DD').isAfter(moment()) %}
			{% set isActive = false %}
		{% endif %}
		<li class="col-sm-4 col-md-3">
			<div class="member-details">
				<h4 id="{{Pledger.fullName|slug}}" class="member-name">
					{% if isActive %}
						{% if Pledger.isAnonymous %}
							<em>Anonymous</em>
						{% else %}
							{{Pledger.fullName}}
						{% endif %}
					{% else %}
						<em>(Member Withdrawn)</em>
					{% endif %}
				</h4>
			<div>
		</li>
	{% endfor %}
	</ul>
</div>
{% endif %}
