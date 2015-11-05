{% include "./calculatorControls.swig" %}

<hr>

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

	<div class="row show-calculated" id="comparisons-before">
		<div class="col-sm-6">
			<div class="calculator-comparison percentile">
				<p>You are in the <span class="number">richest <span class="richest-percentile"></span>%</span> of the world's population</p>
			</div>
			<div id="chart-percentile" class="ct-octave"></div>
		</div>
		<div class="col-sm-6">
			<div class="calculator-comparison multiple">
				<p>Your income is more than <span class="number"><span class="global-average-multiple"></span> times</span> the global average.</p>
			</div>
			<div id="chart-multiple" class="ct-octave"></div>
		</div>
	</div>

	<div class="row show-calculated explanatory-interstitial" id="donation-amount">
		<div class="col-xs-12">
			<p><span class="slabtext">If you donated <strong><span class="donation-percentage"></span>%</strong> of your income....</span></p>
			<input name="donationpercentage" data-slider-id='donation-percentage-control' type="text" data-slider-min="1" data-slider-max="100" data-slider-step="1" data-slider-value="10">
		</div>
	</div>

	<div class="row show-calculated" id="comparisons-after">
		<div class="col-sm-6">
			<div class="calculator-comparison multiple-after-donating">
				<p>... you would still be in the <span class="number">richest <span class="richest-percentile-after-donating"></span>%</span> of the world's population ...</p>
			</div>
			<div id="chart-percentile-after-donating" class="ct-octave"></div>
		</div>
		<div class="col-sm-6">
			<div class="calculator-comparison percentile-after-donating">
				<p>... you'd still have more than <span class="number"><span class="global-average-multiple-after-donating"></span> times</span> the global average income...</p>
			</div>
			<div id="chart-multiple-after-donating" class="ct-octave"></div>
		</div>
	</div>

	<div class="row show-calculated explanatory-interstitial" id="each-year">
		<div class="col-sm-12">
			<p><span class="slabtext">And each year your donations could fund...</span></p>
		</div>
	</div>

	<div class="row show-calculated">
		<div class="col-sm-4">
			<div class="calculator-outcome">
				<p>... the distribution of <span class="number"><i class="icon icon-mosquito-net"></i> <span class="nets"></span></span> insecticide treated bednets ...</p>
			</div>
		</div>
		<div class="col-sm-4">
			<div class="calculator-outcome">
				<p>... or more than <span class="number"><i class="icon icon-pills"></i> <span class="dewormingtreatments"></span></span> deworming treatments ...</p>
			</div>
		</div>
		<div class="col-sm-4">
			<div class="calculator-outcome">
				<p>... equivalent to saving <span class="number"><i class="fa fa-users"></i> <span class="lives"></span> lives</span> Amazing!</p>
			</div>
		</div>
	</div>

	<div class="row show-calculated explanatory-interstitial" id="call-to-action">
		<div class="col-sm-12">
			<p class="challenge"><span class="slabtext">So will you step up?</span></p>
			<p class="action"><span class="slabtext">Are you ready to take our <a href="/pledge">10% pledge</a>?</span></p>
		</div>
	</div>



	<div class="row show-calculated">
		<div class="col-sm-4 calculator-action">
			<p>Let's do this!</p>
			<a href="/become-member" class="btn btn-success">Become a member</a>
		</div>
		<div class="col-sm-4 calculator-action">
			<p>I'm excited, tell me more!</p>
			<a href="/your-impact" class="btn btn-info">Discover the impact you can have</a>
		</div>
		<div class="col-sm-4 calculator-action">
			<p>I'm not convinced....</p>
			<a href="/10-reasons-to-join" class="btn btn-default">Give me 10 good reasons</a>
		</div>
	</div>

	<div class="row show-calculated" id="back-to-top">
		<div class="col-sm-8 col-sm-offset-2">
			<hr>
			<a href="#" class="back-to-calculator btn btn-default">
				<i class="fa fa-chevron-up"></i><br>
				Back to the calculator
			</a>
		</div>
	</div>

</div>
