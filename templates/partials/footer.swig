<div class="container">
    <nav id="footer-main">
		<ul class="row">
			{% for parent in menus['footer'] %}
				{% if parent._menu %}
				<li class="col-md-3">
					<h6>
						{{ parent._menu.fields.title }}
					</h6>
					<ul class="">
						{% for child in parent._children %}
							{% if child._page %}
								<li class="{{ path === child._page.path ? 'active':'' }}">
									{% set childTitle = child._page.shortTitle || child._page.title %}
									<a href="{{ relative(child._page.path) }}">{% if child._page.icon %}<i class="fa {{ child._page.icon }}"></i> {% endif %}{{ childTitle }}</a>
								</li>
							{% elif child._link %}
								<li>
									{% set childTitle = child._link.shortTitle || child._link.title %}
									<a href="{{ child._link.linkURL }}">{% if child._link.icon %}<i class="fa {{ child._link.icon }}"></i> {% endif %}{{ childTitle }}</a>
								</li>
							{% endif %}
						{% endfor %}
					</ul> 
				</li>
				{% endif %}
			{% endfor %}
		</ul>
	</nav>
  <div class="row">
    <div class="col-sm-12">
    <hr>
    	<p><strong>Giving What We Can</strong> is part of the <a href="https://www.centreforeffectivealtruism.org">Centre for Effective Altruism</a>, a registered charity in England and Wales, Registered Charity Number 1149828.</p>
    	<p>&copy; Giving What We Can</p>
    </div>
  </div>
</div>