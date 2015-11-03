;(function ($) {
	"use strict";
    $.extend({
        gwwcCalculator: {
        	init: plugin,
	        controls: pluginControls
        }
    });


    function plugin() {
    	// instantiate plugin controls
    	pluginControls();
    }

    // logic for making controls work
    function pluginControls(){
    	// Logic controlling 'How Rich Am I' block
		var countrySelector = $('#how-rich-am-i select[name=country]')
		var currencyDisplay = $('#how-rich-am-i .currency-display')
		var householdButtons = $('#how-rich-am-i .household-control')
		var householdAdults = $('#how-rich-am-i input[name=adults]')
		var householdChildren = $('#how-rich-am-i input[name=children]')

		updateCurrencyDisplay()

		countrySelector.on('change',updateCurrencyDisplay)

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
			sel.val(value);
		})


		function updateCurrencyDisplay(){
			currencyDisplay.text(getCurrency(countrySelector.val()))
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
    }


})(jQuery);