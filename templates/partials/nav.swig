<nav class="navbar navbar-primary navbar-fixed-top" id="menu-main">
	<div class="container">
		<div class="navbar-header">
			<button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#main-nav-collapse">
				<span class="sr-only">Toggle navigation</span>
				<i class="fa fa-bars"></i>
			</button>
			<a href="{{ relative('/') }}" class="navbar-brand">
				<img src="/images/logos/gwwc-logo-nav.png">
			</a>
		</div>
		<div class="collapse navbar-collapse" id="main-nav-collapse">
			<ul class="nav navbar-nav navbar-right">
				{% set menu = menu || 'main' %}
				{% for parent in navMenus.menus[menu] %}
					{% set page = navMenus.childPages[parent] %}
					<li class="nav dropdown{% if path.indexOf(parent) === 0 %} active{% endif %}">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
							{% if !page %}
								{{ parent }}
							{% else %}
								{{ page.menuTitle || page.title }}
							{% endif %}
							<span class="caret"></span>
						</a>
						<ul class="dropdown-menu">
							{% for childPage in navMenus.children[parent].childPages %}
								{% if childPage.hasOwnProperty('navigation') && childPage.navigation && childPage.navigation.indexOf(menu) > -1 %}
									<li class="{{ path === childPage.path ? 'active':'' }}">
										{% set childTitle = childPage.menuTitle || childPage.title %}
										<a href="{{ relative(childPage.path) }}">{{ childTitle }}</a>
									</li>
								{% endif %}
							{% endfor %}
						</ul>
					</li>
				{% endfor %}
				<li class="nav{% if path.indexOf('blog') === 0 %} active{% endif %}"><a href="{{ relative('blog') }}">Blog</a></li>
				<!-- index: {{path.indexOf('blog/')}} path: {{path}} -->
			</ul>
		</div>
	</div>
</nav>