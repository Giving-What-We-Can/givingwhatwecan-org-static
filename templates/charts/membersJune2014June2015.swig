<div id="members-july2014-june2015-chart" class="ct-chart ct-golden-section ct-horizontal-labels-45"></div>
<script>

loadScript(function(){
	$(function($){
		$.getJSON('https://assets.contentful.com/yglmadi73s3x/4gW7qjM7z2cemsoaU8gmU4/ccedb982d707bbbdbd3a7fa6c18c8142/Member_Join_dates_-_2015-11-22.json',function(joinDates){
			var startDate = Date.parse('Jul 1, 2014');
			var endDate = Date.parse('Jul 1, 2015');
			var dates = {};
			var chartData = {series: [[]], labels: []};
			var runningTotal = 0;
			var monthNames = ["January", "February", "March", "April", "May", "June",  "July", "August", "September", "October", "November", "December"];
			for (var i = 0, l = joinDates.length; i<l; i++) {
				var date = new Date(joinDates[i]*1000);
				if(date < endDate){
					var y = date.getFullYear(),
						m = monthNames[date.getMonth()].substr(0,3),
						x = m + '-' + y;
					runningTotal++;
					if(date > startDate){
						dates[x] = runningTotal;
					}
				}
			}
			for(month in dates){
				chartData.series[0].push(dates[month]);
				chartData.labels.push(month.replace('-',' '))
			}
			console.log(chartData)
			
			var chartOptions = {
				chartPadding: {
					top: 0,
					right: 0,
					bottom: 100,
					left: 60
				},
				plugins: [
		            Chartist.plugins.ctAxisTitle({
		                axisX: {
		                    axisTitle: 'Month',
		                    axisClass: 'ct-axis-title',
		                    offset: {
		                        x: 0,
		                        y: 90
		                    },
		                    textAnchor: 'middle'
		                },
		                axisY: {
		                    axisTitle: 'Number of Members',
		                    axisClass: 'ct-axis-title',
		                    offset: {
		                        x: -120,
		                        y: 50
		                    },
		                    flipTitle: true
		                }
		            })
		        ]
			}


			new Chartist.Line('#members-july2014-june2015-chart',chartData,chartOptions)
			.on('created',function(){
				$('#members-july2014-june2015-chart').find('.ct-point').each(function(){
					var point = $(this)
					point.tooltip({
						container:'body',
						title: numeral(point.attr('ct:value')).format('0,0'),
						placement: 'auto top'
					})
				})
			})
		})
	})
});
</script>