{% for r in _reports %}
	{% if r.data.sys.id === report.sys.id %}
		<hr class="report-divider hidden">
		<h2 class="report-title"></h2>
		<div class="post-details">
			<ul>
				<li class="published hidden">
					<i class="fa fa-calendar"></i> 
					<span class="published-date"></span>
				</li>
				<li class="updated hidden">
					<i class="fa fa-refresh"></i> 
					<span class="updated-date"></span>
				</li>
				<li class="full-report-link">
					<i class="fa fa-file-text-o"></i> 
					<a href="/{{r.path}}" class="read-more-link">Read the full report "{{r.title}}"</a>
				</li>
			</ul>
		</div>
		<div class="report-contents"></div>
		<script>
			loadScript(function(){
				loadContent('{{r.path}}',function(data){
					$('.read-more-link').text('View standalone report');
					$('.report-divider').removeClass('hidden');
					$('.report-title').text("Full Report: "+data.title);
					$('.report-contents').append(data.contents);
					$('.published').removeClass('hidden')
					var monthNames = [
						'Jan',
						'Feb',
						'Mar',
						'Apr',
						'May',
						'Jun',
						'Jul',
						'Aug',
						'Sep',
						'Oct',
						'Nov',
						'Dec',
					]
					var date = new Date(data.date)
					var updated = new Date(data.updated)
					date = [
							date.getDate(),
							monthNames[date.getMonth()],
							date.getFullYear()
						].join(' ')
					updated = [
							updated.getDate(),
							monthNames[updated.getMonth()],
							updated.getFullYear()
						].join(' ')
					$('.published-date').text(date)
					$('.updated-date').text(updated)
					if(date !== updated){
						$('.updated').removeClass('hidden')
					}
				})
			})
		</script>
	{% endif %}
{% endfor %}