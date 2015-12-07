{% if members %}
	{% for person in people %}
		{% if person.set && person.set|contains(members) %}
				<div class="media team-member">
					<div class="media-left team-member-photo">
						{% if person.photo %}
						<img src="{{person.photo.fields.file.url}}">
						{% endif %}
					</div>
					<div class="media-body media-bottom team-member-details">
						<h4 class="team-member-name media-heading">{{ person.title }}</h4>
						<p class="team-member-position">{{ person.position }}</p>
						<div class="team-member-bio">
							{{person.contents}}
						</div>
					</div>
				</div>
		{% endif %}
	{% endfor %}
{% endif %}