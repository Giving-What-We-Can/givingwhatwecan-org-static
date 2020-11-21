{% set alert = _alerts[0] %}

{% if alert %}
	<div id="custom-alert-wrapper">
		<div class="custom-alert">
		{% if alert.link %}
			<a href="{{alert.link}}">
		{% endif %}
			<div class="custom-alert-inner">
				{{ alert.contents }}
			</div>
		{% if alert.link %}
			</a>
		{% endif %}
		</div>
	</div>

	<script>
	loadScript(function () {
		var customAlert = $('#custom-alert-wrapper .custom-alert')
		var threshold = window.innerHeight / 2
		var hiddenClass = 'custom-alert-hidden'

		window.addEventListener('scroll',throttle(handleScroll,50));

		function handleScroll(e) {
			if(window.scrollY > threshold) {
				customAlert.addClass(hiddenClass)
			} else {
				customAlert.removeClass(hiddenClass)
			}
		}

		// https://www.sitepoint.com/throttle-scroll-events/
		function throttle(fn, wait) {
			var time = Date.now();
				return function(e) {
				if ((time + wait - Date.now()) < 0) {
					fn(e);
					time = Date.now();
				}
			}
		}
	})

</script>
{% endif %}
