{% if members %}
	{% for person in _people %}
		{% if person.set && person.set|contains(members) %}
				<div class="media team-member">
					<div class="media-left team-member-photo">
						{% if person.photo %}
						<img src="{{person.photo.fields.file.url}}">
						{% endif %}
					</div>
					<div class="media-body media-bottom team-member-details">
						<a href='/person/{{person.slug}}'>
							<h4 class="team-member-name media-heading">{{ person.title }}</h4>
						</a>
						<p class="team-member-position">{{ person.position }}</p>
						<div class="team-member-bio">
							<p>{{person.shortBio|default(person.excerpt)}}</p>
							<a href='/person/{{person.slug}}'>Read more...</a>
						</div>
					</div>
				</div>
		{% endif %}
	{% endfor %}
{% endif %}
