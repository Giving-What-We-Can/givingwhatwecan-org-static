;(function ($,Chartist,TimelineLite,validateLib) {
    "use strict";
    $.extend({
        gwwcCalculator: function(){

            var calculatorControls = $('#calculator-controls');
            var calculatorBody = $('#calculator-body');

            // set selectors for controls
            var countrySelector = calculatorControls.find('select[name=country]');
            var currencyDisplay = calculatorControls.find('.currency-display');
            var incomeInput = calculatorControls.find('input[name=income]');
            var householdButtons = calculatorControls.find('.household-control');
            var householdAdults = calculatorControls.find('input[name=adults]');
            var householdChildren = calculatorControls.find('input[name=children]');
            var calculateButton = calculatorControls.find('button[type=submit]');
            


            // get URL vars
            var urlVars = getUrlVars();

            // test for calculator body, or standalone controls
            var calculatorBodyPresent = false;
            if($("#calculator-body").length>0){
                calculatorBodyPresent = true;
                var breakpoints = window.breakpoints || {
                    xs:480,
                    sm:768,
                    md:992,
                    lg:1200
                };
                
                // set up selectors

                var calculationDetails = calculatorBody.find('#calculation-details');

                var countryDisplay = calculatorBody.find('.country');
                var incomeDisplay = calculatorBody.find('.income');
                var currencyDisplayBody = calculatorBody.find('.currency');
                var adultsDisplay = calculatorBody.find('.adults');
                var childrenDisplay = calculatorBody.find('.children');

                var richestPercentileDisplay = calculatorBody.find('.richest-percentile');
                var globalAverageMultipleDisplay = calculatorBody.find('.global-average-multiple');

                var donationAmount = calculatorBody.find('#donation-amount');
                var donationAmountDisplay = calculatorBody.find('.donation-percentage');

                var richestPercentileAfterDonatingDisplay = calculatorBody.find('.richest-percentile-after-donating');
                var globalAverageMultipleAfterDonatingDisplay = calculatorBody.find('.global-average-multiple-after-donating');
                

                var comparisonsBefore = calculatorBody.find('#comparisons-before')
                var multipleComparison = calculatorBody.find('.calculator-comparison.multiple')
                var percentileComparison = calculatorBody.find('.calculator-comparison.percentile')
                
                var comparisonsAfter = calculatorBody.find('#comparisons-after')
                var multipleComparisonAfterDonating = calculatorBody.find('.calculator-comparison.multiple-after-donating')
                var percentileComparisonAfterDonating = calculatorBody.find('.calculator-comparison.percentile-after-donating')

                var eachYear = calculatorBody.find('#each-year')


                var netsWrapper = calculatorBody.find('.nets-wrapper');
                var netsDisplay = calculatorBody.find('.nets');
                var dewormingtreatmentsWrapper = calculatorBody.find('.dewormingtreatments-wrapper');
                var dewormingtreatmentsDisplay = calculatorBody.find('.dewormingtreatments');
                var livesWrapper = calculatorBody.find('.lives-wrapper');
                var livesDisplay = calculatorBody.find('.lives');
                var livesUnit = calculatorBody.find('.lives-unit');
                var dalysWrapper = calculatorBody.find('.dalys-wrapper');
                var dalysDisplay = calculatorBody.find('.dalys');
                var dalysUnit = calculatorBody.find('.dalys-unit');

                var callToAction = calculatorBody.find('#call-to-action')

                // create charts
                var chartPercentile
                var chartMultiple

                var chartPercentileAfterDonating
                var chartMultipleAfterDonating

                // create donation percentage slider
                var donationAmountControl = $('input[name=donationpercentage]')
                var donationAmountSlider = donationAmountControl.slider({
                    formatter: function(value) {
                        return 'Donate ' + value + '%';
                    }
                    
                });

                donationAmountSlider
                .on('slide',function(){
                    calculate();
                    if(timeline.isActive()){
                        killAnimation();
                    }
                })
                .on('slideStop',function(){
                    animate('changepercentage');
                })

                // create the timeline
                var timeline = new TimelineLite()

                // push URL vars to form
                $.each(urlVars,function(name,value){
                    calculatorControls.find('[name='+name+']').val(value);
                });

                // listen for link clicks to trigger sharing modal
                $('a').click(function(event){
                    var href = $(this).attr('href');
                    if(href && href !== '' && href.substr(0,1) !== "#" && href.indexOf('{url}') === -1){
                        event.preventDefault();
                        sharingModal(href)
                    }
                })

                // slabtext some of the text
                $('.explanatory-interstitial:not(#calculation-details)').find('p').slabText({viewportBreakpoint:breakpoints.sm})
                
                // add listener for back to top button
                $('.back-to-calculator').on('click',function(event){
                    event.preventDefault();
                    animate('top')
                })
                // listen for mousewheel/touch interactions — if user scrolls more than the threshold, kill the animation.
                var scrollCount = 0;
                var touchTimer;
                $(document).on('mousewheel', function(){
                    if(timeline.isActive()){
                        scrollCount++;
                        if(scrollCount>8){
                            killAnimation()
                        }
                    }
                })
                .on('touchstart', function(){
                    if(timeline.isActive()){
                        touchTimer = setInterval(function(){
                            scrollCount++;
                            if(scrollCount>2){
                                killAnimation()
                            }
                        }, 100);
                    }
                }).on('touchend',function(){
                    clearInterval(touchTimer)
                })
                .on('keyup',function(e){
                    if (e.keyCode == 27) { // escape key pressed
                        killAnimation();
                    }
                })
                // kill animation on form focus
                calculatorControls.focusin(function() {
                    killAnimation();
                })

                // var firstRun = true;
                // run calculation
                calculate(function(){
                    animate();
                });
            }


            function calculate(callback){

                if(!calculatorBodyPresent) return;
                

                if(validate()){
                    
                    update();

                    if(typeof callback === 'function'){

                        callback();
                    }
                }



                // calculatorBody.removeClass('calculated uncalculated').addClass('calculating')

                



            }

            function validate (){
                var rules = {
                    country: {
                        presence: true
                    },
                    income : {
                        presence : true,
                        numericality: {
                            onlyInteger: true,
                            greaterThan: 0,
                        }
                    },
                    adults : {
                        presence : true,
                        numericality: {
                            onlyInteger: true,
                            greaterThan: 0,
                        }
                    }
                }

                var validationErrors = validateLib(calculatorControls,rules)
                
                if(validationErrors){
                    for (var error in validationErrors) {
                        if(validationErrors.hasOwnProperty(error)) {
                            var el = $('[name='+error+']')

                            el.parent('.input-group')
                            .addClass('has-error')

                            el.tooltip({title:validationErrors[error][0],trigger:"manual",placement:"auto bottom"})
                            .tooltip('show')
                            .on('focus change',function(){
                                $(this)
                                .tooltip('hide')

                                $(this).parent('.input-group')
                                .removeClass('has-error')
                            })
                        }
                    }
                    return false;
                }
                return true;
            }

            function update(){
                var country = countrySelector.val();
                var countryName = countrySelector.find('option:selected').text();
                var income = incomeInput.val();
                var currency = getCurrency(country)
                var adults = householdAdults.val()
                var children = householdChildren.val()
                var donationpercentage = donationAmountControl.val();

                var values = calculator(income,country,adults,children,donationpercentage);

                // text display
                countryDisplay  .text(countryName)
                incomeDisplay   .text(income)
                currencyDisplayBody .text(currency)
                adultsDisplay   .text(adults)
                childrenDisplay .text(children)
                if(children<1){
                    $('.if-children').hide()
                } else {
                    $('.if-children').show()
                }

                richestPercentileDisplay.text(parseFloat(values.percentage.toFixed(1)) !== parseFloat(values.percentage) ? values.percentage.toFixed(1) : values.percentage);
                globalAverageMultipleDisplay.text(Math.floor(values.multiple));

                donationAmountDisplay.text(Math.round(values.donationpercentage))


                richestPercentileAfterDonatingDisplay.text(parseFloat(values.percentageafterdonating.toFixed(1)) !== parseFloat(values.percentageafterdonating) ? values.percentageafterdonating.toFixed(1) : values.percentageafterdonating);
                globalAverageMultipleAfterDonatingDisplay.text(Math.floor(values.multipleafterdonating));

                netsDisplay.text(Math.round(values.nets))
                dewormingtreatmentsDisplay.text(Number(values.dewormingtreatments.toPrecision(4)))
                var numLives = Math.round(values.lives);
                var numDalys = Math.round(values.dalys)
                if(numLives === 0){
                    livesWrapper.hide()
                    dalysWrapper.show();
                    dalysDisplay.text('≈'+numDalys)
                    dalysUnit.text(numDalys === 1?'year':'years')
                } else {
                    livesWrapper.show()
                    dalysWrapper.hide();
                    livesDisplay.text(numLives)
                    livesUnit.text(numLives === 1 ?'life':'lives')
                }

                if(!(chartPercentile instanceof Chartist.Pie)){
                    chartPercentile =  new Chartist.Pie("#chart-percentile")
                }
                if(!(chartMultiple instanceof Chartist.Bar)){
                    chartMultiple = new Chartist.Bar("#chart-multiple")
                }
                if(!(chartPercentileAfterDonating instanceof Chartist.Pie)){
                    chartPercentileAfterDonating = new Chartist.Pie("#chart-percentile-after-donating")
                }
                if(!(chartMultipleAfterDonating instanceof Chartist.Bar)){
                    chartMultipleAfterDonating = new Chartist.Bar("#chart-multiple-after-donating")
                }


                chartPercentile.update({
                    series:[{name:"People you're richer than",value:100-Math.round(values.percentage)},{name:'People richer than you',value:Math.round(values.percentage)}]
                })

                chartMultiple.update({
                    labels:["Average person's income",'Your income'],
                    series:[
                        [1,values.multiple]
                    ]
                })


                chartPercentileAfterDonating.update({
                    series:[
                        {name:"People you'd be richer than",value:100-values.percentageafterdonating.toFixed(2)},
                        {name:"People who'd be richer than you",value:values.percentageafterdonating.toFixed(2)}
                    ]
                })

                chartMultipleAfterDonating.update({
                    labels:["Average person's income",'Your income'],
                    series:[
                        [1,values.multiple],
                        [1,values.multipleafterdonating]
                    ]
                })
                    
            }

            function animate(section){

                killAnimation()
                
                
                section = section || "intro";
                section = section === "intro" ? ['details','before','donationpercentage','after','outcomes','calltoaction'] : section;
                section = section === "changepercentage" ? ['after','outcomes','calltoaction'] : section;
                if(section.constructor !== Array){
                    section = [section]
                }

                // calculate window width to work out if we need keyframes for wrapped elements
                var docWidth = $(document).width();
                


                // calculate element offsets

                var navOffset = $('#menu-main').outerHeight()+30
                var offsetElems = [
                    calculatorControls,
                    calculationDetails,
                    comparisonsBefore,
                    multipleComparison,
                    percentileComparison,
                    donationAmount,
                    comparisonsAfter,
                    multipleComparisonAfterDonating,
                    eachYear,
                    percentileComparisonAfterDonating,
                    callToAction
                ]
                for (var i = offsetElems.length - 1; i >= 0; i--) {
                    offsetElems[i].data('offset',offsetElems[i].offset().top-navOffset)
                };


                
                // timeline.clear()

                // timeline = new TimelineLite()

                // build a timeline
                
                var delay = "+=1.5";

                if( section.indexOf("details") >-1 ){
                    timeline.to(window, 0.6, {
                        scrollTo:{y:calculationDetails.data('offset')}, 
                    })
                    delay = "+=3"
                }

                if( section.indexOf("before") >-1 ){
                    timeline.to(window, 0.6, {
                        scrollTo:{y:comparisonsBefore.data('offset')}, 
                    },delay)
                    timeline.from(percentileComparison,0.6,{opacity:0})
                    timeline.from(chartPercentile.container,0.6,{opacity:0,scale:0.7})
                    if(docWidth<breakpoints.sm){
                        timeline.to(window, 0.6, {
                            scrollTo:{y:multipleComparison.data('offset')}, 
                        },delay)
                    }
                    timeline.from(multipleComparison,0.6,{opacity:0})
                    timeline.from(chartMultiple.container,0.6,{opacity:0,scale:0.7})
                    delay = "+=1.5"
                }

                if( section.indexOf("donationpercentage") >-1 ){
                    var donationVal = {number:donationAmountSlider.slider('getValue')};
                    donationAmountSlider.slider('setValue',0); calculate();
                    timeline
                    .to(window, 0.6, {
                        scrollTo:{y:donationAmount.data('offset')}, 
                    },delay)
                    .from(donationAmount,0.6,{opacity:0},"+=0")
                    .from(donationVal,1.3,{number:0,ease:Power1.easeIn,onUpdate:function(){
                        donationAmountSlider.slider('setValue',donationVal.number);
                        calculate();
                    }})
                }
                if( section.indexOf("after") >-1 ){
                    timeline
                    .to(window, 0.6, {
                        scrollTo:{y:donationAmount.data('offset')}, 
                    })
                    .to(window, 0.6, {
                        scrollTo:{y:comparisonsAfter.data('offset')}, 
                    })
                    .from(comparisonsAfter,0.6,{opacity:0},"-=0.6")
                    .from(chartPercentileAfterDonating.container,0.6,{scale:0.7})
                    if(docWidth<breakpoints.sm){
                        timeline.to(window, 0.6, {
                            scrollTo:{y:multipleComparisonAfterDonating.data('offset')}, 
                        },delay)
                        .from(multipleComparisonAfterDonating,0.6,{opacity:0},"-=0.6")
                    }
                    timeline.from(chartMultipleAfterDonating.container,0.6,{scale:0.7})
                }

                if( section.indexOf("outcomes") >-1 ){
                    timeline
                    .to(window, 0.6, {
                        scrollTo:{y:eachYear.data('offset')}, 
                    },delay)
                    .from(eachYear,0.6,{opacity:0},"-=0.6")
                    if(docWidth>=breakpoints.sm){
                        timeline
                        .staggerFrom('.calculator-outcome',1,{opacity:0,top:100},0.5)
                        delay = "+=3"
                    } else {
                        delay = "+=1"
                        $('.calculator-outcome').each(function(){
                            var outcome = $(this)
                            timeline
                            .to(window, 0.6, {
                                scrollTo:{y:outcome.offset().top-navOffset}, 
                            },delay)
                            .from(outcome,0.6,{opacity:0},"-=0.5")
                        })
                    }
                }

                if( section.indexOf("calltoaction") >-1 ){
                    timeline
                    .to(window, 0.6, {
                        scrollTo:{y:callToAction.data('offset')}, 
                    },delay)
                    .from(callToAction,0.6,{opacity:0,scale:0.8})
                    if(docWidth<breakpoints.sm){
                        timeline
                        .to(window, 0.6, {
                            scrollTo:{y:callToAction.data('offset')}, 
                        },delay)
                    }
                    timeline
                    .staggerFrom('.calculator-action',1,{opacity:0,top:100},0.5)

                }

                if( section.indexOf("top") >-1 ){
                    timeline
                    .to(window, 0.6, {
                        scrollTo:{y:calculatorControls.data('offset')}, 
                    })

                }

            }


            function killAnimation(){
                var scrollPos = $(window).scrollTop()
                timeline.progress(1,false);
                scrollCount = 0;
                window.scrollTo(0,scrollPos)
            }



            function sharingModal(href){
                var el = $('#sharing-modal')
                var link = el.find('.get-link')
                var modalButtons = el.find('.btn-primary')
                modalButtons.click(function(event){
                    event.preventDefault();
                    var winTop = $(window).height()/2 - 175;
                    var winLeft = $(window).width()/2 - 260;
                    var shareUrl = window.location.href
                    var url = $(this).attr('href').replace('{url}',shareUrl)
                    window.open(url, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + 520 + ',height=' + 350);
                })
                link
                .val(window.location.href)
                .on('focus',function(){
                    $(this).get(0).setSelectionRange(0,9999);
                })
                .on('mouseup',function(event){
                    event.preventDefault();
                })
                el.modal('show').on('hide.bs.modal',function(){
                    if(href) window.location.href = href;
                })
            }


            /*
            
            Logic for calculator controls
            
            */

            updateCurrencyDisplay();

            countrySelector.on('change',updateCurrencyDisplay);

            calculatorControls.on('submit',function(event){
                event.preventDefault();
            })

            calculateButton.on('click',function(event){
                event.preventDefault();
                var hashVal = "?"+calculatorControls.serialize();
                if(calculatorBodyPresent){
                    if(history.pushState) {
                        history.pushState(null, null, hashVal);
                    }
                    else {
                        window.location.hash = hashVal;
                    }
                    calculate(function(){
                        animate();
                    });
                } else {
                    if (validate()){
                        window.location.href = calculatorControls.attr('action')+hashVal
                    }
                }
            })


            // update display depending on 
            householdButtons.on('click',function(e){
                e.preventDefault();
                var el = $(this), sel, min;
                if(el.hasClass('adults')){
                    sel = householdAdults;
                    min = 1;
                } else {
                    sel = householdChildren;
                    min = 0;
                }
                var value = sel.val();
                if(el.hasClass('increase')){
                    value ++;
                } else {
                    value = value > min ? value -= 1 : min;
                }
                sel.val(value).trigger('change');
            });


            function updateCurrencyDisplay(){
                currencyDisplay.text(getCurrency(countrySelector.val()));
            }

            function getCurrency(countryCode) {
                var nationalcurrencies = {
                    "AFG":"AFN", "ALB":"ALL", "DZA":"DZD", "ASM":"USD",
                    "AND":"EUR", "AGO":"AOA", "AIA":"XCD", "ATG":"XCD",
                    "ARG":"ARS", "ARM":"AMD", "ABW":"AWG", "AUS":"AUD",
                    "AUT":"EUR", "AZE":"AZN", "BHS":"BSD", "BHR":"BHD",
                    "BGD":"BDT", "BRB":"BBD", "BLR":"BYR", "BEL":"EUR",
                    "BLZ":"BZD", "BEN":"XOF", "BMU":"BMD", "BTN":"INR",
                    "BOL":"BOB", "BES":"USD", "BIH":"BAM", "BWA":"BWP",
                    "BVT":"NOK", "BRA":"BRL", "IOT":"USD", "BRN":"BND",
                    "BGR":"BGN", "BFA":"XOF", "BDI":"BIF", "KHM":"KHR",
                    "CMR":"XAF", "CAN":"CAD", "CPV":"CVE", "CYM":"KYD",
                    "CAF":"XAF", "TCD":"XAF", "CHL":"CLP", "CHN":"CNY",
                    "CXR":"AUD", "CCK":"AUD", "COL":"COP", "COM":"KMF",
                    "COG":"XAF", "COK":"NZD", "CRI":"CRC", "HRV":"HRK",
                    "CUB":"CUP", "CUW":"ANG", "CYP":"EUR", "CZE":"CZK",
                    "CIV":"XOF", "DNK":"DKK", "DJI":"DJF", "DMA":"XCD",
                    "DOM":"DOP", "ECU":"USD", "EGY":"EGP", "SLV":"USD",
                    "GNQ":"XAF", "ERI":"ERN", "EST":"EUR", "ETH":"ETB",
                    "FLK":"FKP", "FRO":"DKK", "FJI":"FJD", "FIN":"EUR",
                    "FRA":"EUR", "GUF":"EUR", "PYF":"XPF", "ATF":"EUR",
                    "GAB":"XAF", "GMB":"GMD", "GEO":"GEL", "DEU":"EUR",
                    "GHA":"GHS", "GIB":"GIP", "GRC":"EUR", "GRL":"DKK",
                    "GRD":"XCD", "GLP":"EUR", "GUM":"USD", "GTM":"GTQ",
                    "GGY":"GBP", "GIN":"GNF", "GNB":"XOF", "GUY":"GYD",
                    "HTI":"USD", "HMD":"AUD", "VAT":"EUR", "HND":"HNL",
                    "HKG":"HKD", "HUN":"HUF", "ISL":"ISK", "IND":"INR",
                    "IDN":"IDR", "IRN":"IRR", "IRQ":"IQD", "IRL":"EUR",
                    "IMN":"GBP", "ISR":"ILS", "ITA":"EUR", "JAM":"JMD",
                    "JPN":"JPY", "JEY":"GBP", "JOR":"JOD", "KAZ":"KZT",
                    "KEN":"KES", "KIR":"AUD", "PRK":"KPW", "KOR":"KRW",
                    "KWT":"KWD", "KGZ":"KGS", "LAO":"LAK", "LVA":"EUR",
                    "LBN":"LBP", "LSO":"ZAR", "LBR":"LRD", "LBY":"LYD",
                    "LIE":"CHF", "LTU":"EUR", "LUX":"EUR", "MAC":"MOP",
                    "MKD":"MKD", "MDG":"MGA", "MWI":"MWK", "MYS":"MYR",
                    "MDV":"MVR", "MLI":"XOF", "MLT":"EUR", "MHL":"USD",
                    "MTQ":"EUR", "MRT":"MRO", "MUS":"MUR", "MYT":"EUR",
                    "MEX":"MXN", "FSM":"USD", "MDA":"MDL", "MCO":"EUR",
                    "MNG":"MNT", "MNE":"EUR", "MSR":"XCD", "MAR":"MAD",
                    "MOZ":"MZN", "MMR":"MMK", "NAM":"ZAR", "NRU":"AUD",
                    "NPL":"NPR", "NLD":"EUR", "NCL":"XPF", "NZL":"NZD",
                    "NIC":"NIO", "NER":"XOF", "NGA":"NGN", "NIU":"NZD",
                    "NFK":"AUD", "MNP":"USD", "NOR":"NOK", "OMN":"OMR",
                    "PAK":"PKR", "PLW":"USD", "PAN":"USD", "PNG":"PGK",
                    "PRY":"PYG", "PER":"PEN", "PHL":"PHP", "PCN":"NZD",
                    "POL":"PLN", "PRT":"EUR", "PRI":"USD", "QAT":"QAR",
                    "ROU":"RON", "RUS":"RUB", "RWA":"RWF", "REU":"EUR",
                    "BLM":"EUR", "SHN":"SHP", "KNA":"XCD", "LCA":"XCD",
                    "MAF":"EUR", "SPM":"EUR", "VCT":"XCD", "WSM":"WST",
                    "SMR":"EUR", "STP":"STD", "SAU":"SAR", "SEN":"XOF",
                    "SRB":"RSD", "SYC":"SCR", "SLE":"SLL", "SGP":"SGD",
                    "SXM":"ANG", "SVK":"EUR", "SVN":"EUR", "SLB":"SBD",
                    "SOM":"SOS", "ZAF":"ZAR", "SSD":"SSP", "ESP":"EUR",
                    "LKA":"LKR", "SDN":"SDG", "SUR":"SRD", "SJM":"NOK",
                    "SWZ":"SZL", "SWE":"SEK", "CHE":"CHF", "SYR":"SYP",
                    "TWN":"TWD", "TJK":"TJS", "TZA":"TZS", "THA":"THB",
                    "TLS":"USD", "TGO":"XOF", "TKL":"NZD", "TON":"TOP",
                    "TTO":"TTD", "TUN":"TND", "TUR":"TRY", "TKM":"TMT",
                    "TCA":"USD", "TUV":"AUD", "UGA":"UGX", "UKR":"UAH",
                    "ARE":"AED", "GBR":"GBP", "USA":"USD", "UMI":"USD",
                    "URY":"UYU", "UZB":"UZS", "VUT":"VUV", "VEN":"VEF",
                    "VNM":"VND", "VGB":"USD", "VIR":"USD", "WLF":"XPF",
                    "ESH":"MAD", "YEM":"YER", "ZMB":"ZMW", "ZWE":"ZWL",
                    "ALA":"EUR"
                };
                return nationalcurrencies[countryCode];
            }
            function getUrlVars() {
                var vars = {};
                window.location.href.replace(/([^=#!?&]+)=([^&]+)/gi, function(m,key,value) {
                    vars[key] = value;
                });
                return vars;
            }
        }

    });



    /* 

    logic to display calculator results

    */
    

    /*

    Calculator logic

    */

    function calculator(income,country,adults,children,donationpercentage){

        /********************************
        ***     TABLE OF CONTENTS     ***

        DATA

        CALCULATIONS

        UTILITIES

        *********************************/

        /*-------------------------------------------------------
        DATA
        -------------------------------------------------------*/

        //prices from GiveWell in dollars
        var dollarspernet=(5.30+7.30)/2;//$5.30-$7.30 per net according to http://www.givewell.org/international/top-charities/AMF#CostperLLINdistributed
        var dollarsperdewormingtreatment=1.23;//$1.23 per treatment according to http://www.givewell.org/international/top-charities/schistosomiasis-control-initiative#Whatdoyougetforyourdollar
        var dollarsperlifesaved=3340;//$3,340 per life saved according to http://www.givewell.org/international/top-charities/AMF#Costperlifesaved
        var dollarsperdaly=(100+100)/2  // AMF averts 1 DALY for around $100, SCI averts 1 DALY for around $100 

        //world income distribution in 2008 PPP USD
        //The data from 0-72.736 is from PovcalNet ( http://iresearch.worldbank.org/PovcalNet/index.htm?1 ). These raw centile values have been multiplied by 0.8 to account for the fact that rich countries are excluded from the surveys. The figure of 0.8 was chosen by cross-referencing the data with Branko Milanovic's in order to produce a smooth curve.
        //The data from 79-99 is from personal correspondence with Branko Milanovic.
        //The data for 99.9 is based on a figure of $70,000 from "The Haves and the Have-Nots" by Branko Milanovic. This figure appears to be from 2005 and so has been adjusted for inflation between 2005 and 2008 using http://www.whatsthecost.com/cpi.aspx .
        var incomecentiles=[[0,0],[0.232,60],[0.896,120],[1.944,180],[3.744,240],[6.84,300],[10.984,360],[15.472,420],[18.128,456],[19.856,480],[21.952,510],[23.952,540],[25.872,570],[27.672,600],[29.408,630],[31.056,660],[32.632,690],[34.12,720],[35.536,750],[36.92,780],[38.2,810],[39.392,840],[41.592,900],[43.592,960],[45.408,1020],[47.04,1080],[48.544,1140],[49.928,1200],[51.208,1260],[52.392,1320],[53.504,1380],[54.536,1440],[56.44,1560],[58.112,1680],[59.616,1800],[61.6,1980],[63.336,2160],[65.328,2400],[67.016,2640],[68.464,2880],[69.768,3120],[70.832,3360],[71.752,3600],[72.736,3900],[79,6030],[80,6431],[81,6949],[82,7549],[83,8120],[84,8826],[85,9506],[86,10402],[87,11245],[88,12164],[89,13323],[90,14447],[91,15644],[92,17093],[93,18307],[94,20383],[95,22632],[96,25401],[97,29491],[98,35472],[99,46822],[99.9,75894.28]];

        //purchasing power parity conversion factors in local currency units per $ (combines exchange rates and purchasing power adjustments)
        //using the most recent available value (generally 2014) from http://data.worldbank.org/indicator/PA.NUS.PPP
        //dropdown menu of countries is based on those in this list
        //Kosovo has been removed as it doesn't have a country code
        //COD, SSD, PSE, ZMB and ZWE have been commented out as they don't have an exchange rate
        //TWN has been added a value from the old calculator
        var pppconversionfactor={
            "ABW":1.260119143,
            "AFG":18.91965254,
            "AGO":72.1458477,
            "ALB":47.45958377,
            "ARE":2.589615072,
            "ARG":2.664829,
            "ARM":184.6011644,
            "ATG":1.713140883,
            "AUS":1.5221,
            "AUT":0.843908,
            "AZE":0.357474059,
            "BDI":538.2541536,
            "BEL":0.850167,
            "BEN":222.0016611,
            "BFA":223.1500937,
            "BGD":25.97071496,
            "BGR":0.702422326,
            "BHR":0.21169455,
            "BHS":0.959070749,
            "BIH":0.720173693,
            "BLR":3817.909097,
            "BLZ":1.15328977,
            "BMU":1.592092474,
            "BOL":3.231967311,
            "BRA":1.608005724,
            "BRB":1.91564865,
            "BRN":0.672211598,
            "BTN":18.69642313,
            "BWA":3.900872493,
            "CAF":272.5761629,
            "CAN":1.251681,
            "CHE":1.379342,
            "CHL":354.906796,
            "CHN":3.519721277,
            "CIV":235.2801839,
            "CMR":231.9333437,
            "COG":266.6187708,
            "COL":1177.958042,
            "COM":208.8037784,
            "CPV":48.74227842,
            "CRI":366.8190024,
            "CUB":0.321938711,
            "CUW":1.292181626,
            "CYM":0.958799448,
            "CYP":0.673796213,
            "CZE":13.39312,
            "DEU":0.793791,
            "DJI":98.87433033,
            "DMA":1.873141355,
            "DNK":7.673446,
            "DOM":20.16861901,
            "DZA":31.94165588,
            "ECU":0.551229702,
            "EGY":1.926829273,
            "ERI":6.992911578,
            "ESP":0.680064,
            "EST":0.550572,
            "ETH":6.658551114,
            "FIN":0.931505,
            "FJI":1.039538705,
            "FRA":0.854056,
            "FSM":0.899671711,
            "GAB":296.7440883,
            "GBR":0.698545,
            "GEO":0.835631535,
            "GHA":0.907688211,
            "GIN":2924.909768,
            "GMB":10.43046585,
            "GNB":197.9467802,
            "GNQ":301.1149407,
            "GRC":0.644565,
            "GRD":1.829434369,
            "GTM":3.744910567,
            "GUY":117.3299706,
            "HKG":5.556630242,
            "HND":10.15424872,
            "HRV":3.633390575,
            "HTI":20.76218022,
            "HUN":129.278794,
            "IDN":3802.421172,
            "IND":16.72380204,
            "IRL":0.832193,
            "IRN":5626.21848,
            "IRQ":535.1901807,
            "ISL":138.204269,
            "ISR":4.006398,
            "ITA":0.761802,
            "JAM":59.63547677,
            "JOR":0.313357744,
            "JPN":104.089852,
            "KAZ":89.19964846,
            "KEN":38.37717849,
            "KGZ":19.04774748,
            "KHM":1333.341852,
            "KIR":0.92131476,
            "KNA":1.783469443,
            "KOR":860.219004,
            "KWT":0.178780174,
            "LAO":2694.269465,
            "LBN":871.4716968,
            "LBR":39.07425966,
            "LBY":0.723693377,
            "LCA":1.886599992,
            "LKA":43.48547905,
            "LSO":4.2205305,
            "LTU":1.586918532,
            "LUX":0.915436,
            "LVA":0.360528717,
            "MAC":5.119455442,
            "MAR":3.611324406,
            "MDA":6.03497475,
            "MDG":722.5866115,
            "MDV":8.78726192,
            "MEX":8.041976,
            "MHL":0.929816214,
            "MKD":19.33193128,
            "MLI":215.1889879,
            "MLT":0.588945963,
            "MMR":234.9739642,
            "MNE":0.378888998,
            "MNG":655.1860742,
            "MOZ":16.47992526,
            "MRT":105.5892402,
            "MUS":16.42587276,
            "MWI":105.7976605,
            "MYS":1.422758876,
            "NAM":5.735852192,
            "NER":224.0044126,
            "NGA":83.28667791,
            "NIC":9.85731508,
            "NLD":0.828707,
            "NOR":9.203809,
            "NPL":27.12581032,
            "NZL":1.46843,
            "OMN":0.198339156,
            "PAK":26.83137045,
            "PAN":0.568431989,
            "PER":1.529177889,
            "PHL":17.95739941,
            "PLW":0.782332822,
            "PNG":1.787910213,
            "POL":1.821618,
            "PRI":0.820922202,
            "PRT":0.588847,
            "PRY":2268.045357,
            "QAT":2.485249783,
            "ROU":1.664581237,
            "RUS":18.425035,
            "RWA":280.275866,
            "SAU":1.807159905,
            "SDN":2.469204994,
            "SEN":230.6228187,
            "SGP":0.876674368,
            "SLB":6.894799109,
            "SLE":1904.954052,
            "SLV":0.492788787,
            "SMR":0.7102569,
            "SOM":11427.68,
            "SRB":41.55854963,
            //"SSD":1.518788461,
            "STP":9996.798902,
            "SUR":2.017558268,
            "SVK":0.513071,
            "SVN":0.607999,
            "SWE":8.80733,
            "SWZ":4.384310179,
            "SXM":1.379053699,
            "SYC":7.939077259,
            "SYR":21.3249,
            "TCA":1.100246354,
            "TCD":249.2355917,
            "TGO":226.120537,
            "THA":12.33643486,
            "TJK":1.965435589,
            "TKM":1.625380724,
            "TLS":0.532329816,
            "TON":1.447047026,
            "TTO":3.855195107,
            "TUN":0.63043928,
            "TUR":1.11207,
            "TUV":1.102632317,
            "TZA":597.9037644,
            "UGA":1015.684425,
            "UKR":3.638666846,
            "URY":17.09110173,
            "USA":1,
            "UZB":761.2985879,
            "VCT":1.669239771,
            "VEN":4.79056252,
            "VNM":7546.476018,
            "VUT":100.2694323,
            //"PSE":2.180399697,
            "WSM":1.668374593,
            "YEM":79.95226789,
            "ZAF":5.167337654,
            //"COD":550.3747148,
            //"ZMB":2.53583574,
            //"ZWE":0.520380616,
            "TWN":1/0.0416,
        };

        //multiplying the values from 2008 to 2014 obtained using http://data.worldbank.org/indicator/FP.CPI.TOTL.ZG
        //using the US value of around 14% for countries with no available data
        //Kosovo has been removed as it doesn't have a country code
        //TWN has been added
        var inflationfactor={
            "ABW":1.120095443,
            "AND":1.14,
            "AFG":1.607606468,
            "AGO":2.138431364,
            "ALB":1.197067336,
            "ARB":1.385331545,
            "ARE":1.208358333,
            "ARG":1.14,
            "ARM":1.465967614,
            "ASM":1.14,
            "ATG":1.170377269,
            "AUS":1.207174538,
            "AUT":1.158482246,
            "AZE":1.444199546,
            "BDI":2.138509174,
            "BEL":1.152804772,
            "BEN":1.235283576,
            "BFA":1.20544182,
            "BGD":1.679378525,
            "BGR":1.262033135,
            "BHR":1.178051458,
            "BHS":1.155079694,
            "BIH":1.145056948,
            "BLR":4.764343698,
            "BLZ":1.091590919,
            "BMU":1.14,
            "BOL":1.551066504,
            "BRA":1.47754364,
            "BRB":1.3808668,
            "BRN":1.062866969,
            "BTN":1.69162943,
            "BWA":1.67887726,
            "CAF":1.248618785,
            "CAN":1.12299985,
            "CEB":1.215658344,
            "CHE":1.019320949,
            "CHI":1.14,
            "CHL":1.14711578,
            "CHN":1.230128273,
            "CIV":1.195839548,
            "CMR":1.187554234,
            "COG":1.323792008,
            "COL":1.277042815,
            "COM":1.162260548,
            "CPV":1.194150487,
            "CRI":1.558076966,
            "CSS":1.202961371,
            "CUB":1.14,
            "CUW":1.14,
            "CYM":1.14,
            "CYP":1.117654534,
            "CZE":1.167898466,
            "DEU":1.110079806,
            "DJI":1.320896552,
            "DMA":1.138714587,
            "DNK":1.1431281,
            "DOM":1.449277071,
            "DZA":1.393514603,
            "EAP":1.359225934,
            "EAS":1.282413387,
            "ECA":1.421153967,
            "ECS":1.203350743,
            "ECU":1.379263331,
            "EGY":2.092646504,
            "EMU":1.140930228,
            "ERI":1.14,
            "ESP":1.130936039,
            "EST":1.355565677,
            "ETH":3.215181261,
            "EUU":1.153241711,
            "FCS":1.375276733,
            "FIN":1.148225975,
            "FJI":1.37078086,
            "FRA":1.102738446,
            "FRO":1.14,
            "FSM":1.14,
            "GAB":1.136744576,
            "GBR":1.222222222,
            "GEO":1.321562261,
            "GHA":2.353439613,
            "GIN":2.238648083,
            "GMB":1.403626683,
            "GNB":1.191009347,
            "GNQ":1.451675745,
            "GRC":1.131976302,
            "GRD":1.174938406,
            "GRL":1.14,
            "GTM":1.401305091,
            "GUM":1.14,
            "GUY":1.243132651,
            "HIC":1.170319615,
            "HKG":1.281449893,
            "HND":1.542372881,
            "HPC":1.521512002,
            "HRV":1.183847069,
            "HTI":1.556944693,
            "HUN":1.292799703,
            "IDN":1.504688879,
            "IMN":1.14,
            "IND":1.88846399,
            "INX":1.14,
            "IRL":1.034194164,
            "IRN":3.936635263,
            "IRQ":1.416517291,
            "ISL":1.542356493,
            "ISR":1.191320749,
            "ITA":1.135971096,
            "JAM":2.049273778,
            "JOR":1.421809207,
            "JPN":1.020519609,
            "KAZ":1.732207802,
            "KEN":2.020140608,
            "KGZ":1.970954773,
            "KHM":1.498916916,
            "KIR":1.14,
            "KNA":1.181430791,
            "KOR":1.20750371,
            "KWT":1.378122717,
            "LAC":1.372405873,
            "LAO":1.36125599,
            "LBN":1.052248762,
            "LBR":1.688419995,
            "LBY":1.461286724,
            "LCA":1.182089706,
            "LCN":1.344537112,
            "LDC":1.554735534,
            "LIC":1.555929072,
            "LIE":1.14,
            "LKA":1.706871536,
            "LMC":1.517397813,
            "LMY":1.461512309,
            "LSO":1.517016905,
            "LTU":1.274701624,
            "LUX":1.153614864,
            "LVA":1.268916519,
            "MAC":1.418888577,
            "MAF":1.14,
            "MAR":1.106341463,
            "MCO":1.14,
            "MDA":1.499861829,
            "MDG":1.699522987,
            "MDV":1.645004289,
            "MEA":1.364221789,
            "MEX":1.340281946,
            "MHL":1.14,
            "MIC":1.426856944,
            "MKD":1.201016988,
            "MLI":1.229920352,
            "MLT":1.155911542,
            "MMR":1.558522015,
            "MNA":1.401037623,
            "MNE":1.238367904,
            "MNG":2.262303608,
            "MNP":1.14,
            "MOZ":1.516702573,
            "MRT":1.34626644,
            "MUS":1.369070551,
            "MWI":2.617100471,
            "MYS":1.191777322,
            "NAC":1.132388184,
            "NAM":1.561237454,
            "NCL":1.14,
            "NER":1.182820852,
            "NGA":2.063400009,
            "NIC":1.72424839,
            "NLD":1.139942265,
            "NOC":1.222909032,
            "NOR":1.154019112,
            "NPL":1.885784653,
            "NZL":1.16886608,
            "OEC":1.148298031,
            "OED":1.154793357,
            "OMN":1.31695205,
            "OSS":1.433094589,
            "PAK":2.205998723,
            "PAN":1.377287453,
            "PER":1.25723834,
            "PHL":1.35600907,
            "PLW":1.14,
            "PNG":1.438694642,
            "POL":1.215123698,
            "PRI":1.14,
            "PRK":1.14,
            "PRT":1.098891133,
            "PRY":1.431502663,
            "PSS":1.302125675,
            "PYF":1.14,
            "QAT":1.177733454,
            "ROU":1.387989518,
            "RUS":1.785574709,
            "RWA":1.544304772,
            "SAS":1.726598793,
            "SAU":1.407007096,
            "SDN":3.139897323,
            "SEN":1.106750723,
            "SGP":1.253790245,
            "SLB":1.521239806,
            "SLE":2.271164532,
            "SLV":1.185924405,
            "SMR":1.178291192,
            "SOM":1.14,
            "SRB":1.691681665,
            "SSA":1.537121238,
            "SSD":1.564632994,
            "SSF":1.537102996,
            "SST":1.304037522,
            "STP":2.305297378,
            "SUR":1.594607289,
            "SVK":1.170602582,
            "SVN":1.155794712,
            "SWE":1.079107779,
            "SWZ":1.54447508,
            "SXM":1.14,
            "SYC":2.046602032,
            "SYR":1.780900758,
            "TCA":1.14,
            "TCD":1.305754771,
            "TGO":1.237072492,
            "THA":1.202519257,
            "TJK":1.809277633,
            "TKM":1.14,
            "TLS":1.660770335,
            "TON":1.287871698,
            "TTO":1.600783026,
            "TUN":1.37078843,
            "TUR":1.728333641,
            "TUV":1.14,
            "TZA":1.965551051,
            "UGA":1.959876454,
            "UKR":1.92848178,
            "UMC":1.359181363,
            "URY":1.702174094,
            "USA":1.141764288,
            "UZB":1.14,
            "VCT":1.197038807,
            "VEN":3.497416762,
            "VIR":1.14,
            "VNM":2.061024139,
            "VUT":1.174596607,
            "PSE":1.129162255,
            "WLD":1.3300692,
            "WSM":1.28592666,
            "YEM":2.032380428,
            "ZAF":1.540394907,
            "COD":1.660751669,
            "ZMB":1.809900674,
            "ZWE":1.090794885,
            "TWN":1.14
        };

        //current market exchange rates in local currency units per $ used for converting donations to dollars
        //last updated 01/06/2015 using http://www.xe.com/currencytables
        var exchangerates={
            "USD":1,
            "EUR":0.916487105,
            "GBP":0.658567215,
            "INR":63.60598606,
            "AUD":1.31400812,
            "CAD":1.254957118,
            "SGD":1.354637515,
            "CHF":0.947130424,
            "MYR":3.692316801,
            "JPY":124.6473654,
            "CNY":6.199465289,
            "NZD":1.409325808,
            "THB":33.72056584,
            "HUF":283.0780343,
            "AED":3.673,
            "HKD":7.756789618,
            "MXN":15.47070657,
            "ZAR":12.25840296,
            "PHP":44.54939998,
            "SEK":8.587010428,
            "IDR":13207.74167,
            "SAR":3.75035,
            "BRL":3.16749351,
            "TRY":2.67856761,
            "KES":97.60003047,
            "KRW":1115.738553,
            "EGP":7.6250008,
            "IQD":1189.999936,
            "NOK":7.966961545,
            "KWD":0.303080217,
            "RUB":53.41454878,
            "DKK":6.83608538,
            "PKR":101.9250001,
            "ILS":3.874430355,
            "PLN":3.781480762,
            "QAR":3.639550002,
            "XAU":0.000837607,
            "OMR":0.384800019,
            "COP":2549.114895,
            "CLP":623.7215504,
            "TWD":30.87259675,
            "ARS":8.996657146,
            "CZK":25.14802446,
            "VND":21720.00019,
            "MAD":9.855976282,
            "JOD":0.708000244,
            "BHD":0.377000036,
            "XOF":601.1761322,
            "LKR":133.8783073,
            "UAH":21.05003924,
            "NGN":199.0999978,
            "TND":1.967499985,
            "UGX":3065.0016,
            "RON":4.071223129,
            "BDT":77.75004,
            "PEN":3.154999977,
            "GEL":2.3010714,
            "XAF":601.1761322,
            "FJD":2.075,
            "VEF":6.301249965,
            "BYR":14810.004,
            "HRK":6.938897106,
            "UZS":2533,
            "BGN":1.792436333,
            "DZD":99.45031694,
            "IRR":28890.008,
            "DOP":44.78004678,
            "ISK":134.85,
            "XAG":0.059207448,
            "CRC":530.2024122,
            "SYP":188.8217523,
            "LYD":1.370000001,
            "JMD":114.9000815,
            "MUR":35.45000102,
            "GHS":4.080000724,
            "AOA":110.2476272,
            "UYU":26.80001524,
            "AFN":58.40003353,
            "LBP":1505.00112,
            "XPF":109.366003,
            "TTD":6.319208039,
            "TZS":2110.00112,
            "ALL":129,
            "XCD":2.700000003,
            "GTQ":7.667500499,
            "NPR":101.9039738,
            "BOB":6.860016133,
            "ZWD":361.9,
            "BBD":2,
            "CUC":1,
            "LAK":8098.0056,
            "BND":1.354637515,
            "BWP":9.982452844,
            "HNL":21.99999893,
            "PYG":5110.008,
            "ETB":20.6,
            "NAD":12.25840296,
            "PGK":2.69175,
            "SDG":5.979999955,
            "MOP":7.989493307,
            "NIO":26.6,
            "BMD":1,
            "KZT":185.8200153,
            "PAB":1,
            "BAM":1.792492975,
            "GYD":203.2007969,
            "YER":215.0249997,
            "MGA":3199.999974,
            "KYD":0.819999997,
            "MZN":37.49999911,
            "RSD":110.2496935,
            "SCR":13.39999982,
            "AMD":478.5398791,
            "SBD":7.82778865,
            "AZN":1.050859796,
            "SLL":4380.000038,
            "TOP":1.982750074,
            "BZD":1.97980557,
            "MWK":449.999972,
            "GMD":42.58032183,
            "BIF":1545.0032,
            "SOS":702.5,
            "HTG":47.20016076,
            "GNF":7438.262422,
            "MVR":15.26999949,
            "MNT":1905.0008,
            "CDF":908.0016,
            "STD":22300,
            "TJS":6.26849991,
            "KPW":130.372807,
            "MMK":1096.9992,
            "LSL":12.25840296,
            "LRD":92.49992138,
            "KGS":58.14720896,
            "GIP":0.658567215,
            "XPT":0.000899313,
            "MDL":18.05001524,
            "CUP":26.5,
            "KHR":4060.0016,
            "MKD":55.87003093,
            "VUV":105.1003185,
            "MRO":291.5,
            "ANG":1.767500843,
            "SZL":12.25840296,
            "CVE":100.6000625,
            "SRD":3.240008009,
            "XPD":0.001290284,
            "SVC":8.75,
            "BSD":1,
            "XDR":0.719549993,
            "RWF":690,
            "AWG":1.79,
            "DJF":177.00016,
            "BTN":63.60598606,
            "KMF":450.8820992,
            "WST":2.518881569,
            "SPL":0.166666667,
            "ERN":10.46999712,
            "FKP":0.658567215,
            "SHP":0.658567215,
            "JEP":0.658567215,
            "TMT":3.5,
            "TVD":1.31400812,
            "IMP":0.658567215,
            "GGP":0.658567215
        };

        //using ISO3166-1-Alpha-3 and currency alphabetic codes from http://data.okfn.org/data/core/country-codes
        var nationalcurrencies={
            "AFG":"AFN",
            "ALB":"ALL",
            "DZA":"DZD",
            "ASM":"USD",
            "AND":"EUR",
            "AGO":"AOA",
            "AIA":"XCD",
            "ATG":"XCD",
            "ARG":"ARS",
            "ARM":"AMD",
            "ABW":"AWG",
            "AUS":"AUD",
            "AUT":"EUR",
            "AZE":"AZN",
            "BHS":"BSD",
            "BHR":"BHD",
            "BGD":"BDT",
            "BRB":"BBD",
            "BLR":"BYR",
            "BEL":"EUR",
            "BLZ":"BZD",
            "BEN":"XOF",
            "BMU":"BMD",
            "BTN":"INR",
            "BOL":"BOB",
            "BES":"USD",
            "BIH":"BAM",
            "BWA":"BWP",
            "BVT":"NOK",
            "BRA":"BRL",
            "IOT":"USD",
            "BRN":"BND",
            "BGR":"BGN",
            "BFA":"XOF",
            "BDI":"BIF",
            "KHM":"KHR",
            "CMR":"XAF",
            "CAN":"CAD",
            "CPV":"CVE",
            "CYM":"KYD",
            "CAF":"XAF",
            "TCD":"XAF",
            "CHL":"CLP",
            "CHN":"CNY",
            "CXR":"AUD",
            "CCK":"AUD",
            "COL":"COP",
            "COM":"KMF",
            "COG":"XAF",
            "COK":"NZD",
            "CRI":"CRC",
            "HRV":"HRK",
            "CUB":"CUP",
            "CUW":"ANG",
            "CYP":"EUR",
            "CZE":"CZK",
            "CIV":"XOF",
            "DNK":"DKK",
            "DJI":"DJF",
            "DMA":"XCD",
            "DOM":"DOP",
            "ECU":"USD",
            "EGY":"EGP",
            "SLV":"USD",
            "GNQ":"XAF",
            "ERI":"ERN",
            "EST":"EUR",
            "ETH":"ETB",
            "FLK":"FKP",
            "FRO":"DKK",
            "FJI":"FJD",
            "FIN":"EUR",
            "FRA":"EUR",
            "GUF":"EUR",
            "PYF":"XPF",
            "ATF":"EUR",
            "GAB":"XAF",
            "GMB":"GMD",
            "GEO":"GEL",
            "DEU":"EUR",
            "GHA":"GHS",
            "GIB":"GIP",
            "GRC":"EUR",
            "GRL":"DKK",
            "GRD":"XCD",
            "GLP":"EUR",
            "GUM":"USD",
            "GTM":"GTQ",
            "GGY":"GBP",
            "GIN":"GNF",
            "GNB":"XOF",
            "GUY":"GYD",
            "HTI":"USD",
            "HMD":"AUD",
            "VAT":"EUR",
            "HND":"HNL",
            "HKG":"HKD",
            "HUN":"HUF",
            "ISL":"ISK",
            "IND":"INR",
            "IDN":"IDR",
            "IRN":"IRR",
            "IRQ":"IQD",
            "IRL":"EUR",
            "IMN":"GBP",
            "ISR":"ILS",
            "ITA":"EUR",
            "JAM":"JMD",
            "JPN":"JPY",
            "JEY":"GBP",
            "JOR":"JOD",
            "KAZ":"KZT",
            "KEN":"KES",
            "KIR":"AUD",
            "PRK":"KPW",
            "KOR":"KRW",
            "KWT":"KWD",
            "KGZ":"KGS",
            "LAO":"LAK",
            "LVA":"EUR",
            "LBN":"LBP",
            "LSO":"ZAR",
            "LBR":"LRD",
            "LBY":"LYD",
            "LIE":"CHF",
            "LTU":"EUR",
            "LUX":"EUR",
            "MAC":"MOP",
            "MKD":"MKD",
            "MDG":"MGA",
            "MWI":"MWK",
            "MYS":"MYR",
            "MDV":"MVR",
            "MLI":"XOF",
            "MLT":"EUR",
            "MHL":"USD",
            "MTQ":"EUR",
            "MRT":"MRO",
            "MUS":"MUR",
            "MYT":"EUR",
            "MEX":"MXN",
            "FSM":"USD",
            "MDA":"MDL",
            "MCO":"EUR",
            "MNG":"MNT",
            "MNE":"EUR",
            "MSR":"XCD",
            "MAR":"MAD",
            "MOZ":"MZN",
            "MMR":"MMK",
            "NAM":"ZAR",
            "NRU":"AUD",
            "NPL":"NPR",
            "NLD":"EUR",
            "NCL":"XPF",
            "NZL":"NZD",
            "NIC":"NIO",
            "NER":"XOF",
            "NGA":"NGN",
            "NIU":"NZD",
            "NFK":"AUD",
            "MNP":"USD",
            "NOR":"NOK",
            "OMN":"OMR",
            "PAK":"PKR",
            "PLW":"USD",
            "PAN":"USD",
            "PNG":"PGK",
            "PRY":"PYG",
            "PER":"PEN",
            "PHL":"PHP",
            "PCN":"NZD",
            "POL":"PLN",
            "PRT":"EUR",
            "PRI":"USD",
            "QAT":"QAR",
            "ROU":"RON",
            "RUS":"RUB",
            "RWA":"RWF",
            "REU":"EUR",
            "BLM":"EUR",
            "SHN":"SHP",
            "KNA":"XCD",
            "LCA":"XCD",
            "MAF":"EUR",
            "SPM":"EUR",
            "VCT":"XCD",
            "WSM":"WST",
            "SMR":"EUR",
            "STP":"STD",
            "SAU":"SAR",
            "SEN":"XOF",
            "SRB":"RSD",
            "SYC":"SCR",
            "SLE":"SLL",
            "SGP":"SGD",
            "SXM":"ANG",
            "SVK":"EUR",
            "SVN":"EUR",
            "SLB":"SBD",
            "SOM":"SOS",
            "ZAF":"ZAR",
            "SSD":"SSP",
            "ESP":"EUR",
            "LKA":"LKR",
            "SDN":"SDG",
            "SUR":"SRD",
            "SJM":"NOK",
            "SWZ":"SZL",
            "SWE":"SEK",
            "CHE":"CHF",
            "SYR":"SYP",
            "TWN":"TWD",
            "TJK":"TJS",
            "TZA":"TZS",
            "THA":"THB",
            "TLS":"USD",
            "TGO":"XOF",
            "TKL":"NZD",
            "TON":"TOP",
            "TTO":"TTD",
            "TUN":"TND",
            "TUR":"TRY",
            "TKM":"TMT",
            "TCA":"USD",
            "TUV":"AUD",
            "UGA":"UGX",
            "UKR":"UAH",
            "ARE":"AED",
            "GBR":"GBP",
            "USA":"USD",
            "UMI":"USD",
            "URY":"UYU",
            "UZB":"UZS",
            "VUT":"VUV",
            "VEN":"VEF",
            "VNM":"VND",
            "VGB":"USD",
            "VIR":"USD",
            "WLF":"XPF",
            "ESH":"MAD",
            "YEM":"YER",
            "ZMB":"ZMW",
            "ZWE":"ZWL",
            "ALA":"EUR"
        };

        /*-------------------------------------------------------
        CALCULATIONS
        -------------------------------------------------------*/

        /*
        The calculator works as follows: the user's income is converted to dollars and adjusted for PPP, inflation and household size.
        The result is then used to calculate the user's centile by interpolation using the world income distribution data.
        */

        //calculate the world median income in 2008 PPP USD by interpolation
        var medianincome=(function(){
            for(var i=0;i<incomecentiles.length;i++){
                if(i>0&&incomecentiles[i][0]>50){
                    return incomecentiles[i-1][1]+(((50-incomecentiles[i-1][0])*(incomecentiles[i][1]-incomecentiles[i-1][1]))/(incomecentiles[i][0]-incomecentiles[i-1][0]));
                }
            }
            return 1200;//give an approximate value in case the above calculation doesn't work
        })();

        //get the centile from 2008 PPP USD by interpolation
        function getcentile(income){
            for(var i=0;i<incomecentiles.length;i++){
                if(income<=incomecentiles[i][1]){
                    if(i==0){
                        return incomecentiles[0][0];
                    }
                    return incomecentiles[i-1][0]+(((income-incomecentiles[i-1][1])*(incomecentiles[i][0]-incomecentiles[i-1][0]))/(incomecentiles[i][1]-incomecentiles[i-1][1]));
                }
            }
            return incomecentiles[incomecentiles.length-1][0];
        }

        //calculate how to adjust for household size using OECD equivalised income
        //the weightings are for first adult, subsequent adults and children respectively: 1, 0.7, 0.5
        function equivalisationfactor(adults,children){
            return 1/((adults==1?1:0.3+adults*0.7)+(children/2));
        }

        //calculate the factor the income needs to be multiplied by to account for currency conversion, purchasing power, inflation and household size (converting to 2008 PPP USD)
        function adjustmentfactor(country,adults,children){
            //convert income to dollars while adjusting for purchasing power
            var factor=1/pppconversionfactor[country];
            //adjust for inflation
            factor=factor/inflationfactor[country];
            //adjust for household size
            factor=factor*equivalisationfactor(adults,children);
            return factor;
        }

        //return an object containing the data to be displayed
        function howrichami(income,country,adults,children,donationpercentage){
            donationpercentage = parseInt(donationpercentage);
            var adjustedincome=income*adjustmentfactor(country,adults,children);
            var adjustedincomeafterdonating=adjustedincome*(1-donationpercentage/100);
            var dollardonation=income*(1/exchangerates[nationalcurrencies[country]])*(donationpercentage/100);
            return {
                "percentage":100-getcentile(adjustedincome),
                "multiple":adjustedincome/medianincome,
                "percentageafterdonating":100-getcentile(adjustedincomeafterdonating),
                "multipleafterdonating":adjustedincomeafterdonating/medianincome,
                "nets":dollardonation/dollarspernet,
                "dewormingtreatments":dollardonation/dollarsperdewormingtreatment,
                "lives":dollardonation/dollarsperlifesaved,
                "dalys":dollardonation/dollarsperdaly,
                "donationpercentage": donationpercentage
            };
        }

        //this function not actually used for anything
        /*
        function calcPreTax(threshold, incomeLevels, taxPercents, maxIncomeLevel) {
                
            var incomeLevel;
            var nextIncomeLevel;
            var taxPercent;
            var preTaxSoFar = 0;
            var postTaxSoFar = 0;
            
            for (var i = 0; ; i++){
                incomeLevel = incomeLevels[i];
                nextIncomeLevel = incomeLevels[i+1];
                taxPercent = taxPercents[i];
                if ( (incomeLevel == maxIncomeLevel) || ((nextIncomeLevel - incomeLevel) * (100 - taxPercent) / 100 + postTaxSoFar > threshold) )
                {
                    preTaxSoFar += (threshold - postTaxSoFar) / (100 - taxPercent) * 100;
                    break;
                }
                else
                {
                    postTaxSoFar += (nextIncomeLevel - incomeLevel) * (100 - taxPercent) / 100;
                    preTaxSoFar += (nextIncomeLevel - incomeLevel);
                }
            }
            
            return preTaxSoFar;    
        }
        */

        /*-------------------------------------------------------
        UTILITIES
        -------------------------------------------------------*/

        function filterChars(s, charList){
            var s1 = "" + s; //force s1 to be a string data type
            var i;
            for (i = 0; i < s1.length; )
            {
                if (charList.indexOf(s1.charAt(i)) < 0)
                    s1 = s1.substring(0,i) + s1.substring(i+1, s1.length);
                else
                    i++;
            }
            return s1;
        };
        function makeNumeric(s){
            return filterChars(s, "1234567890.-");
        };
        function numval(val,digits,minval,maxval){
            val = makeNumeric(val);
            if (val == "" || isNaN(val)) val = 0;
            val = parseFloat(val);
            if (digits != null)
            {
                var dec = Math.pow(10,digits);
                val = (Math.round(val * dec))/dec;
            }
            if (minval != null && val < minval) val = minval;
            if (maxval != null && val > maxval) val = maxval;
            return parseFloat(val);
        };
        function formatNumber(val,digits,minval,maxval){
            var sval = "" + numval(val,digits,minval,maxval);
            var i;
            var iDecpt = sval.indexOf(".");
            if (iDecpt < 0) iDecpt = sval.length;
            if (digits != null && digits > 0)
            {
                if (iDecpt == sval.length)
                    sval = sval + ".";
                var places = sval.length - sval.indexOf(".") - 1;
                for (i = 0; i < digits - places; i++)
                    sval = sval + "0";
            }
            var firstNumchar = 0;
            if (sval.charAt(0) == "-") firstNumchar = 1;
            for (i = iDecpt - 3; i > firstNumchar; i-= 3)
                sval = sval.substring(0, i) + "," + sval.substring(i);

            return sval;
        };
        function customRound(n){
            return (n<10?n.toPrecision(2):n.toFixed(0))*1;
        };

        return howrichami(income,country,adults,children,donationpercentage)


    }
    
    $.gwwcCalculator()
})(jQuery,Chartist,TimelineLite,validate);