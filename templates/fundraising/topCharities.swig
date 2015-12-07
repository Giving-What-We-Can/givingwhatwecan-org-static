<div class="row">
	{% set charitySlugs =    ['against-malaria-foundation','schistosomiasis-control-initiative','deworm-the-world-initiative','project-healthy-children'] %}
	{% set charityDescriptions =    [
		'Malaria kills over half a million people every year, but the <strong>Against Malaria Foundation</strong> can provide an insecticide treated bednet for under <strong>$8</strong>.',
		'Schistosomiasis is a parasitic disease that has serious consequences for school attendance, but the <strong>Schistosomiasis Control Initiative</strong> can provide a child with treatment for less than <strong>$2</strong>.',
		'Treating parasitic worms is one of the most effective ways to improve school retention, and the <strong>Deworm The World Initiative</strong> can deworm children for under <strong>$2</strong>.',
		'Vitamin and mineral deficiencies can have serious health consequences and lead to learning difficulties, but <strong>Project Healthy Children</strong> provides technical assistance to help governments create micronutrient fortification programmes that only cost <strong>a few cents per person</strong> per year.'] %}

	{% for charitySlug in charitySlugs %}
		<div class="col-sm-6 col-md-3 charity {{charitySlug}}">
			<div class="logo">
			{% for charity in charities %}
				{% if charity|contains(charitySlug,'slug') %}
					<img class="img-responsive" src="{{ charity.logo.fields.file.url }}">
				{% endif %}
			{% endfor %}
			</div>
			<div class="description">
				<p>{{charityDescriptions[loop.index0]}}</p>
			</div>
		</div>
	{% endfor %}
</div>