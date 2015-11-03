<nav class="navbar navbar-primary navbar-fixed-top" id="menu-main">
	<div class="container">
		<div class="navbar-header">
			<button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#main-nav-collapse">
				<span class="sr-only">Toggle navigation</span>
				<i class="fa fa-bars"></i>
			</button>
			<a href="{{ relative('/') }}" class="navbar-brand">
				<img src="/images/logos/gwwc-logo-transparent-nav.png">
			</a>
		</div>
		<div class="collapse navbar-collapse" id="main-nav-collapse">
			<ul class="nav navbar-nav navbar-right">
				{% set menu = menu || 'main' %}
				{% for parent in menus[menu] %}
					{% if parent._menu %}
					<li class="nav dropdown">
						 <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
							{{ parent._menu.fields.title }}
							<span class="caret"></span>
						</a>
						<ul class="dropdown-menu">
							{% for child in parent._children %}
								{% if child._page %}
									<li class="{{ path === child._page.path ? 'active':'' }}">
										{% set childTitle = child._page.shortTitle || child._page.title %}
										<a href="{{ relative(child._page.path) }}">{{ childTitle }}</a>
									</li>
								{% endif %}
							{% endfor %}
						</ul> 
					</li>
					{% elif parent._page %}
					<li class="nav">
						{% set pageTitle = parent._page.shortTitle || parent._page.title %}
						<a href="{{ relative(parent._page.path) }}">{{pageTitle}}</a>
					</li>
					{% elif parent._link %}
					<li class="nav">
						{% set linkTitle = parent._link.shortTitle || parent._link.title %}
						<a href="{{ parent._link.linkURL }}"{% if parent._link.shortTitle ==='Donate' %}style="font-weight:400;"{% endif %}>
							{{linkTitle}}
						</a>
					</li>
					{% endif %}
				{% endfor %}
				<li class="nav{% if path.indexOf('blog') === 0 %} active{% endif %}"><a href="{{ relative('blog') }}">Blog</a></li>
				<!-- index: {{path.indexOf('blog/')}} path: {{path}} -->
			</ul>
		</div>
	</div>
</nav>