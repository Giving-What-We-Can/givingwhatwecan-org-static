<iframe src='https://howrichami.givingwhatwecan.org/embed' id='calculator' class='resize-iframe'></iframe>

<script>
	console.log(`script tag is here`)
	loadScript(function () {
		console.log('Resizer called')
		iFrameResize({ log: true}, '#calculator')
	})
</script>
