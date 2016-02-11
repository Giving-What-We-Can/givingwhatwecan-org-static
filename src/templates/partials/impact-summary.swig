{% set fieldValues = [importance,tractability,neglectedness,costEffectiveness,robustnessOfEvidence,trackRecord] %}
{% set fieldNames = ["Importance","Tractability","Neglectedness","Cost Effectiveness","Robustness of Evidence","Track Record"] %}
<ul class="impact-summary-list">
{% set count = 0 %}
{% for value in fieldValues %}
	{% if value && value >= 0 %}
		{% set count+=1 %}
		<li class="impact-summary-item">
			<span class="impact-summary-item-title">{{fieldNames[loop.index0]}}:</span>
			<span class="impact-summary-item-score-icons">
				{% set odds = [1,3,5,7,9] %}
				{% if odds|contains(value) %}
					{% set full = value/2-0.5 %}
					{% set half = true %}
				{% else %}
					{% set full = value/2 %}
					{% set half = false %}
				{% endif %}
				{% set counter = [1,2,3,4,5] %}
				{% for c in counter %}
					{%  if c<=full %}
						<i class="fa fa-check-circle"></i>
					{% elif half %}
						<i class="fa fa-check-circle-o"></i>
						{% set half = false%}
					{% else %}
						<i class="fa fa-circle-thin"></i>
					{% endif %}
				{% endfor %}
				<span class="impact-summary-item-score-text">{{value/2}}/5</span>
			</span>
		</li>
	{% endif %}
{% endfor %}
{% if roomForMoreFunding %}
	{% set count+=1 %}
	<li class="impact-summary-item">
		<span class="impact-summary-item-title">Room for More Funding:</span>
		<span class="impact-summary-item-score-icons"><i class="fa fa-ok"></i>
			<span class="impact-summary-item-score-text">Yes</span>
		</span>
	</li>
{% endif %}
{% if count === 0 %}
	<li class="impact-summary-no-data">
		Sorry, we don't currently have an impact summary for <strong>{{title}}</strong>.
	</li>
{% endif %}
</ul>

