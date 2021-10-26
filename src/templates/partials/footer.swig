<div class="container">
    <nav id="footer-main">
		<div class='row newsletter-row'>
			<div class='col-sm-6'>
				<h6>Sign up for our newsletter</h6>
				{% include "./newsletter-signup.swig" %}
			</div>
		</div>
		<ul class="row">
			{% for parent in menus['footer-menu'] %}
				{% if parent._menu %}
				<li class="col-md-4">
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
	<div class='row'>
			<div class='col-sm-8'>
				<h6>Follow us and join the conversation</h6>
				<ul class='list-inline list-unstyled'>
					<li>
						<a title="FaceBook" href='https://facebook.com/givingwhatwecan' target='_blank'>
							<i class='fa fa-facebook'></i>
						</a>
					</li>
					<li>
						<a title="Instagram" href='https://www.instagram.com/giving_what_we_can' target='_blank'>
							<i class='fa fa-instagram'></i>
						</a>
					</li>
					<li>
						<a title="Twitter" href='https://twitter.com/Effect_Altruism' target='_blank'>
							<i class='fa fa-twitter'></i>
						</a>
					</li>
					<li>
						<a title="Youtube" href='https://www.youtube.com/c/GivingWhatWeCanCommunity' target='_blank'>
							<i class='fa fa-youtube'></i>
						</a>
					</li>
					<li>
						<a title="LinkedIn" href='https://www.linkedin.com/company/giving-what-we-can' target='_blank'>
							<i class='fa fa-linkedin'></i>
						</a>
					</li>
					<li>
						<a title="TikTok" href='https://www.tiktok.com/@givingwhatwecan' target='_blank'>
							TikTok
						</a>
					</li>
				</ul>
			</div>
	</div>
	<div class='row'>
		<div class='col-sm-4'>
			<h6>Join our effective giving community</h6>
			<a class='btn btn-primary btn-block btn-sm' href='/pledge'>Take a pledge</a>
		</div>
	</div>
  <div class="row">
    <div class="col-sm-12 center">
    <hr>
    	<p><strong>Giving What We Can</strong> is part of the <a href="https://www.centreforeffectivealtruism.org">Centre for Effective Altruism</a>, a registered charity in England and Wales, Registered Charity Number 1149828.</p>
    	<p>&copy; Giving What We Can</p>
    	<p>
				<a href='https://www.centreforeffectivealtruism.org/privacy-policy'>Privacy policy</a> |
				<a href='https://www.effectivealtruism.org/terms-and-conditions/'>Terms and Conditions</a>
			</p>
    </div>
  </div>
</div>
