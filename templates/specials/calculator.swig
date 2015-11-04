{% include "./calculatorControls.swig" %}


<div class="noscript">
	<div class="row">
		<div class="col-xs-12">
			<p>The Calculator requires Javascript to be enabled.</p>
		</div>
	</div>
</div>

<div id="calculator-body" class="onlyscript calculated">

	<div class="row show-calculating">
		<div class="col-md-6 col-md-offset-3">
			<p class="">
				Calculating...
			</p>
		</div>
	</div>

	<div class="row show-calculated">
		<div class="col-sm-6">
			<div class="calculator-comparison">
				<p>You are in the <span class="number">richest <span class="richest-percentile"></span>%</span> of the world's population</p>
			</div>
			<div id="chart-percentile" class="ct-octave"></div>
		</div>
		<div class="col-sm-6">
			<div class="calculator-comparison">
				<p>Your income is more than <span class="number"><span class="global-average-multiple"></span> times</span> the global average.</p>
			</div>
			<div id="chart-multiple" class="ct-octave"></div>
		</div>
	</div>

	<div class="row show-calculated" id="donation-amount">
		<div class="col-xs-12">
			<p>By donating <span class="donation-percentage"></span> of your income....</p>
		</div>
	</div>

	<div class="row show-calculated">
		<div class="col-xs-12">
			<p>[--------()----]</p>
		</div>
	</div>

	<div class="row show-calculated">
		<div class="col-sm-6">
			<div class="calculator-comparison">
				<p>... you would still be in the <span class="number">richest <span class="richest-percentile-after-donating"></span>%</span> of the world's population</p>
			</div>
			<div id="chart-percentile-after-donating" class="ct-octave"></div>
		</div>
		<div class="col-sm-6">
			<div class="calculator-comparison">
				<p>and your income would still be more than <span class="number"><span class="global-average-multiple-after-donating"></span> times</span> the global average.</p>
			</div>
			<div id="chart-multiple" class="ct-octave-after-donating"></div>
		</div>
	</div>

</div>
