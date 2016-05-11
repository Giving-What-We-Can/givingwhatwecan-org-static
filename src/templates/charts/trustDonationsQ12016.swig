<figure>
	<div class="container">
		<div class="row">
			<div class="col-sm-6">
				<div id="trust-donations-q1-2016-chart" class="ct-chart ct-square"></div>
			</div>
			<div class="col-sm-6">
				<table class="table table-striped">
					<thead>
						<tr>
							<td><span class="sr-only">&#xA0;</span></td>
							<th>Source</th>
							<th class="right">Amount</th>
						</tr>
					</thead>
					<tbody>
						<tr class="ct-series-a">
							<td class="ct-legend-item-color">&nbsp;</td>
							<td>Giving What We Can Website</td>
							<td class="right">£330,740</td>
						</tr>
						<tr class="ct-series-b">
							<td class="ct-legend-item-color">&nbsp;</td>
							<td>GiveWell referral</td>
							<td class="right">£81,057</td>
						</tr>
						<tr class="ct-series-c">
							<td class="ct-legend-item-color">&nbsp;</td>
							<td>Payroll Giving	</td>
							<td class="right">£37,934</td>
						</tr>
						<tr class="ct-series-d">
							<td class="ct-legend-item-color">&nbsp;</td>
							<td>Charity Referral</td>
							<td class="right">£51,594</td>
						</tr>
						<tr class="ct-series-e">
							<td class="ct-legend-item-color">&nbsp;</td>
							<td>Other</td>
							<td class="right">£4,386</td>
						</tr>
					</tbody>
					<tfoot>
						<tf>
							<td><span class="sr-only">Total Row</span></td>
							<td><strong>Total</strong></td>
							<td class="right"><strong>&#xA3;505,820</strong></td>
						</tf>
					</tfoot>
				</table>
			</div>
		</div>
	</div>
	<figcaption>
		Referral sources for money moved through the Giving What We Can Trust
	</figcaption>
</figure>
<script>

loadScript(function(){
	$(function($){
		var numeral = window.numeral;
		var chartData = {};
		chartData.labels = [
			"Giving What We Can Website",
			"GiveWell referral",
			"Payroll Giving	",
			"Charity Referral",
			"Other",
		]
		chartData.series = [
				330740.45,
				81057.71,
				37934.59,
				51594.05,
				4386.96
		];
		console.log(chartData)
		
		var chartOptions = {
			chartPadding: {
				top: 0,
				right: 50,
				bottom: 0,
				left: 50
			},
			labelOffset: 50,
		}
		new Chartist.Pie('#trust-donations-q1-2016-chart',chartData,chartOptions)
		.on('created',function(){
			var total = 0;
			for (var i = 0; i < chartData.series.length; i++) {
				total+=chartData.series[i];
			}
			$('#trust-donations-q1-2016-chart').find('.ct-slice-pie').each(function(index){
				var slice = $(this)
				var title = '£' + numeral(slice.attr('ct:value')).format('0,0') + ' ('+(slice.attr('ct:value')/total*100).toFixed(0)+'%)';
				slice.tooltip({
					container:'body',
					title: title,
					placement: 'auto right'
				})
			})
		});
	})
})
</script>