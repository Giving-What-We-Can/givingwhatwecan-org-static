<!--
.container
	.row
		nav.col-sm-12
			ul.list-inline
				- var menu = 'footer'
				if navMenus.menus[menu]
					each parent in navMenus.menus[menu]
						-var page = navMenus.childPages[parent];
							li
								ul.footer-nav.list-unstyled
									li.header
										!= page.title
									li.separator
									each childPage in navMenus.children[parent].childPages
										li
											- var childTitle = childPage.menuTitle ? childPage.menuTitle : childPage.title;
											a(href=relative(childPage.path))!= childTitle
					li |
				li
					a(href="https://www.facebook.com/GivingWhatWeCan")
						i.fa.fa-facebook
						|  Facebook
				li
					a(href="https://twitter.com/GivingWhatWeCan")
						i.fa.fa-twitter
						|  Twitter
	.row
		.col-sm-12
			p
				| Giving What We Can is part of the Centre for Effective Altruism, a registered charity in England and Wales, Registered Charity Number 1149828.
			p
				| &copy; Giving What We Can
-->