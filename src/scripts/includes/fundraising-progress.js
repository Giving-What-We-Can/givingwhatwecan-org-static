/* global jQuery cookies */
(function ($, cookies) {
  $(document).ready(function () {
    // don't run if we don't need to
    // if (!$('.fundraising-bar').length) return
    // get the elements we need
    var menu = $('#menu-main')
    var progressBar = $('.fundraising-bar-progress-progress-bar')
    var goalRemainingBar = $('.fundraising-bar-progress-goal-remaining')
    var progressIndicator = $('.fundraising-bar-targets-target-progress')
    var goalIndicator = $('.fundraising-bar-targets-target-goal')
    var stretchGoalIndicator = $('.fundraising-bar-targets-target-stretch-goal')
    var bars = [progressBar, goalRemainingBar, progressIndicator, goalIndicator, stretchGoalIndicator]
    var transitions = []
    // as soon as possible, set the width on everything to zero
    $.each(bars, function (index, bar) {
      transitions.push(bar.css('transition'))
      bar.css({transition: 'none'}).width(0)
    })
    // constants
    // var USD_TO_GBP_EXCHANGE_RATE = 0.81
    var GBP_TO_USD_EXCHANGE_RATE = 1.24
    var GOAL_SCALING_FACTOR = 0.95 // the amount of the bar taken up by the goal vs the stretch goal
    // get progress, goal, and stretch goal amounts
    var progressAmount = progressIndicator.data('amount')
    var goalAmount = goalIndicator.data('amount')
    var stretchGoalAmount = stretchGoalIndicator.data('amount')
    // get data
    $.get('http://api.effectivealtruism.org/v1/payments?format=total&from=2016-11-26&to=2017-01-10')
      .done(function (data) {
        var total = data.reduce(function (prev, curr) {
          // add the net amount to the total, correcting for exchange rate
          var net = parseFloat(curr.net)
          if (curr.currency.toUpperCase() === 'GBP') net = net * GBP_TO_USD_EXCHANGE_RATE
          return prev + net
        }, 0)
        // add progress from the API to the stock progress
        var newProgressAmount = total + progressAmount
        run(newProgressAmount)
      })
      .error(function (error) {
        console.error(error)
        run(progressAmount)
      })

    function run (progressAmount) {
      var fundraisingCTANav = $('.fundraising-cta-navigation')
      // hide / show the navbar fundraising CTA if it's on the page
      if (fundraisingCTANav.length) {
        setTimeout(function () {
          menu.addClass('fundraising-cta-shown')
          if (cookies.get('fundraisingCTAHidden')) return
          // set a cookie so we know the user's seen the callout
          var viewcount = parseInt(cookies.get('fundraisingCTAViewed'), 10) || 0
          viewcount = viewcount + 1
          cookies.set('fundraisingCTAViewed', viewcount.toString(), {expires: 30})
          // show the widget
          fundraisingCTANav
            .collapse('show')
            .on('shown.bs.collapse', function () { progressBarInit(progressAmount) })
          $('.fundraising-cta-navigation-close').click(function (event) {
            event.preventDefault()
            menu.removeClass('fundraising-cta-shown')
            fundraisingCTANav.collapse('hide')
            // set a cookie so we know the user's hidden the callout
            // valid for a day the first time the user clicks it, valid for two weeks thereafter
            var expires = viewcount < 1 ? 1 : 14
            cookies.set('fundraisingCTAHidden', 'true', {expires: expires})
          })
        }, 1000)
      } else {
        // if we don't have the navbar element, but there's a CTA on the page, just run the animations
        setTimeout(function () {
          progressBarInit(progressAmount)
        }, 500)
      }
    }

    function progressBarInit (progressAmount) {
      // figure out bar percentages
      var progressPercentage
      var goalPercentage
      var stretchGoalPercentage = 100
      if (progressAmount <= goalAmount) {
        // if we're under the regular goal, get progress as a percentage of that, and scale by GOAL_SCALING FACTOR
        progressPercentage = (progressAmount / goalAmount * 100 * GOAL_SCALING_FACTOR)
        goalPercentage = (GOAL_SCALING_FACTOR * 100)
      } else if (progressAmount <= stretchGoalAmount) {
        // if we made it to the stretch goal, just scale normally, using the stretch goal as the target
        progressPercentage = (progressAmount / stretchGoalAmount * 100)
        goalPercentage = (goalAmount / stretchGoalAmount * 100)
      } else if (progressAmount > stretchGoalAmount) {
        // if we made it past the stretch goal (!) then scale everything to the progress amount
        progressPercentage = 100
        goalPercentage = (goalAmount / progressAmount * 100)
        stretchGoalPercentage = (stretchGoalAmount / progressAmount * 100)
      }
      var widths = [progressPercentage, goalPercentage, progressPercentage, goalPercentage, stretchGoalPercentage]
      var amounts = [0, 0, progressAmount, goalAmount, stretchGoalAmount]
      // update the amounts and widths
      $.each(bars, function (index, bar) {
        bar
          .css({transition: transitions[index]})
          .width(widths[index].toFixed(2) + '%')
        if (amounts[index]) {
          var amount = parseInt(amounts[index], 10).toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
          bar.find('.fundraising-bar-targets-target-amount-number').text(amount)
        }
      })
    }
  })
})(jQuery, cookies)
