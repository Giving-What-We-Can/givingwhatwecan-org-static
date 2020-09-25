{% set memberList = memberList || stats.Pledgers %}
{% if memberList %}
<div class="row">
	<ol class="member-list">
	{% for Pledger in memberList %}
		<li class="col-sm-4">
			<div class="member-details{% if Pledger.anonymous%} member-details-anonymous{% endif %}">
				<h4 id="{{Pledger.rankByPledgeType}}-{{Pledger.fullName|slug}}" class="member-name">
					{{Pledger.fullName|default('(Anonymous)')}}
				</h4>
				<p>{{ moment(Pledger.pledgeStart, 'YYYY-MM-DD').format('MMMM YYYY') }}</p>
			<div>
		</li>
	{% endfor %}
	</ol>
</div>
{% endif %}
