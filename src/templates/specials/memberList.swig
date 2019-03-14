{% if stats.Pledgers %}
<div class="row">
	<ol class="member-list">
	{% for Pledger in stats.Pledgers %}
		<li class="col-sm-4">
			<div class="member-details{% if Pledger.anonymous%} member-details-anonymous{% endif %}">
				<h4 id="{{Pledger.rankByPledgeType}}-{{Pledger.fullName|slug}}" class="member-name">
					{{Pledger.fullName}}
				</h4>
				<p>{{ moment(Pledger.pledgeStart, 'YYYY-MM-DD').format('MMMM YYYY') }}</p>
			<div>
		</li>
	{% endfor %}
	</ol>
</div>
{% endif %}
