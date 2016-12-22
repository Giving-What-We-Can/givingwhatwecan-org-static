{% if slug !== "join" %}

<div class="fundraising-cta-navigation collapse">
  <div class="container">
    <a href="#" class="fundraising-cta-navigation-close hidden-xs hidden-sm pull-right">Close<i class="fa fa-times"> </i></a>
    <div class="fundraising-cta">
  <div class="fundraising-cta-text">
    <h3 class="fundraising-cta-title">Giving What We Can is fundraising for 2017</h3>
    <p class="fundraising-cta-description">We need your support to continue to grow our community of committed, effective givers. Help us make 2017 even bigger by making a donation to our parent organisation, <a href="https://www.centreforeffectivealtruism.org/">The Centre for Effective Altruism</a>.</p>
  </div>
  <div class="row">
    <div class="col-md-8">
      <div class="fundraising-cta-progress">
        
        <div class="fundraising-bar">
          <div class="progress fundraising-bar-progress">
            <div role="progressbar" aria-valuenow="5" aria-valuemin="0" aria-valuemax="100" class="fundraising-bar-progress-progress-bar progress-bar"><span class="sr-only"> <span class="fundraising-bar-progress-percentage">5</span>% Complete</span></div>
            <div class="fundraising-bar-progress-goal-remaining"></div>
          </div>
          <div class="fundraising-bar-targets">
            <div data-amount="{{fundraisingAmounts.progress}}" class="fundraising-bar-targets-target fundraising-bar-targets-target-progress">
              <span class="fundraising-bar-targets-target-text-wrapper"><span class="fundraising-bar-targets-target-text">Progress</span><span class="fundraising-bar-targets-target-amount">$<span class="fundraising-bar-targets-target-amount-number">{{fundraisingAmounts.progress}}</span></span></span></div>
            <div data-amount="{{fundraisingAmounts.minimum_target}}" class="fundraising-bar-targets-target fundraising-bar-targets-target-goal">
              <span class="fundraising-bar-targets-target-text-wrapper"><span class="fundraising-bar-targets-target-text">Minimum Target</span><span class="fundraising-bar-targets-target-amount">$<span class="fundraising-bar-targets-target-amount-number">{{fundraisingAmounts.minimum_target}}</span></span></span></div>
            <div data-amount="{{fundraisingAmounts.growth_target}}" class="fundraising-bar-targets-target fundraising-bar-targets-target-stretch-goal">
              <span class="fundraising-bar-targets-target-text-wrapper"><span class="fundraising-bar-targets-target-text">Growth Target</span><span class="fundraising-bar-targets-target-amount">$<span class="fundraising-bar-targets-target-amount-number">{{fundraisingAmounts.growth_target}}</span></span></span></div>
          </div>
        </div>

      </div>
    </div>
    <div class="col-md-4">
      <div class="fundraising-cta-cta">
        <div class="row">
          <div class="col-xs-12 col-sm-6"><a href="https://www.centreforeffectivealtruism.org/fundraising" class="btn btn-default">More Info <i class="fa fa-file-text"></i></a>
          </div>
          <div class="col-xs-12 col-sm-6"><a href="https://www.centreforeffectivealtruism.org/donate" class="btn btn-primary">Donate Now <i class="fa fa-heart"></i></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    <div class="center"><a href="#" class="fundraising-cta-navigation-close hidden-md hidden-lg">Close<i class="fa fa-times"></i></a></div>
  </div>
</div>

<script type="text/javascript">
  loadScript('fundraising-progress')
</script>
{% endif %}
