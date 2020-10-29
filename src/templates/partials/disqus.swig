<div id="disqus-thread-trigger" style="position: absolute; top: 500px;"></div>
<div id="disqus_thread"></div>
<script>
	// Global disqus config
	window.disqus_config = function () {
		this.page.url = "{{canonicalURL|escape}}";
		this.page.identifier = "{{data.sys.id}}";
	};

	// wrap everything in a closure so we don't create global vars
	;(function () {
		// Create Disqus script element
		var disqusScriptElement = document.createElement('script')
		disqusScriptElement.src = 'https://gwwc.disqus.com/embed.js'
		var loaded = false

		// Defer script loading until user has scrolled past trigger element
		var observer = new IntersectionObserver(function (entries) {
			if (entries[0].boundingClientRect.y < 0 && !loaded) {
				appendDisqus()
			}
		})

		// function to append disqus script to the page
		function appendDisqus () {
			document.body.appendChild(disqusScriptElement)
			// once we've loaded, we can remove the observer
			observer.disconnect()
		}

		// start observing
		observer.observe(document.getElementById('disqus-thread-trigger'))
	})()

</script>
<div class="noscript">Please enable JavaScript to view the comments.</div>
