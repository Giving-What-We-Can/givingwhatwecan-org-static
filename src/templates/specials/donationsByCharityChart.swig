{% if stats.donationsByCharity %}


<div class="row">
	<div class="col-md-8">
		<div id="donations-by-charity-chart" class="ct-chart ct-square"></div>
	</div>
	<div class="col-md-4">
		<ul id="donations-by-charity-legend" class="ct-legend list-unstyled">

		</ul>
	</div>
</div>

<script>loadScript(function(){

	var donationsByCharity = {{stats.donationsByCharityWithoutOther|json}}
	var series = [];
	var labels = [];
	var otherValue = 0;
	for (var i = 0,l=donationsByCharity.length; i<l; i++) {
		if(i<70 && donationsByCharity[i][0]!=='Other'){
			labels.push(donationsByCharity[i][0])
			series.push({
				name:  donationsByCharity[i][0],
				value: donationsByCharity[i][1].toFixed(0),
				meta:  donationsByCharity[i][0]
			})
		} else {
			otherValue += donationsByCharity[i][1];
		}
	};
	labels.push('Other')
	series.push({name:'Other',value:otherValue.toFixed(0),meta:'Other'})

	var chart = new Chartist.Pie('.ct-chart', {
		labels: labels,
		series: series
	},{
		showLabel: false,
		startAngle: 0,
		chartPadding: 0,
		labelPosition: 'outside',
		labelOffset: 5,
		labelDirection: 'explode'
	})


	$(function($){
		chart.on('created',function(event){
			$('#donations-by-charity-chart').find('.ct-slice-pie').each(function(){
				var slice = $(this)
				slice.tooltip({
					container:'body',
					title:slice.attr('ct:meta') + ': ' + numeral(slice.attr('ct:value')).format('$0,0'),
					placement: 'auto top'
				})
			})
			$('.ct-slice-pie').on('mouseenter',function(){
				$('.ct-slice-pie').attr('style','opacity:0.4')
				$(this).attr('style','opacity:1')
			})
			.on('mouseleave',function(){
				$('.ct-slice-pie').attr('style','opacity:1')
			})
			// create the legend
			var alpha = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(',');
			for (var i = 0, j,l=labels.length; i<l; i++) {
				j = i % 26;
				$('<li class="ct-legend-item ct-series-'+alpha[j]+' col-xs-12 col-md-12" data-name="'+labels[i]+'"><span class="ct-legend-item-color"></span>'+ labels[i] + '</li>')
				.appendTo('#donations-by-charity-legend')
				.on('mouseenter touchstart',function(){
					var meta = $(this).attr('data-name');
					$('.ct-slice-pie').each(function(){
						if($(this).attr('ct:meta') === meta){
							$('.ct-slice-pie').attr('style','opacity:0.4')
							$(this).attr('style','opacity:1')
							$(this).tooltip('show');
							return false;
						}
					})
				})
				.on('mouseleave touchend',function(){
					$('.ct-slice-pie').tooltip('hide')
					$('.ct-slice-pie').attr('style','opacity:1')
				})
			}
		})



	})

})</script>

{% endif %}
