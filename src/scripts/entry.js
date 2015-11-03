/*

	## Entry.js ##

	This is the master file that organises all of the other scripts used by the site. 

	It uses Browserify to bundle scripts together into a single script, enabling control 
	over load order (as opposed to simply concatenating the directory), and keeps most
	scripts out of the global scope.

	All plugins are installed via NPM to the master node_modules directory. 

	If a plugin is not available via NPM, or the NPM package's 'main' script is not the
	script you want, you may need to set a 'browser' key in the master package.json.

	See this post for more details:
	http://blog.npmjs.org/post/112064849860/using-jquery-plugins-with-npm 

*/

// bootstrap javascript plugins
require('bootstrapDropdown')
require('bootstrapCollapse')
require('bootstrapTransition')


// GreenSock Animation Plugin
require('gsap-tweenlite');
require('gsap-timelinelite');
require('GSAPCSSPlugin');
require('GSAPScrollToPlugin');

// ScrollMagic
global.ScrollMagic = require('scrollmagic')
require('scrollmagicJQuery')
require('scrollmagicAnimationGSAP')

// slabText
require('slabText');

// chartist
global.Chartist = require('chartist')
require('chartistAxisTitle')

// user scripts
require('gwwcCalculator')