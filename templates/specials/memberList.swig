{% if stats.memberList %}
<div class="row">
	<ul class="member-list list-unstyled">
	{% for member in stats.memberList %}
		{% if member[0].length > 30%}
			{% set memberDetailsClass = "col-sm-8 col-md-6" %}
		{% else %}
		{% endif %}
			{% set memberDetailsClass = "col-sm-4 col-md-3" %}
		<li class="{{memberDetailsClass}} member-details">
			<h4 id="{{member[0]|slug}}" class="member-name">{{member[0]}}</h4>
			{% if member[1] %}<p class="member-occupation">{{member[1]}}</p>{% endif %}
		</li>
	{% endfor %}
	</ul>
</div>
{% endif %}