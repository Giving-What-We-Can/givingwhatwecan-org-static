// Metalsmith 2 uses generators, so this ensures we're running node/V8 with the '--harmony' flag 
// Start the build!
console.log('\nGenerating the Giving What We Can site!\n');
console.log('Initialising new build...');
console.log('Loading Metalsmith...');
// Metalsmith
var Metalsmith = require('metalsmith');
// templating
console.log('Loading templating...');
var metadata = require('metalsmith-metadata');
var filemetadata = require('metalsmith-filemetadata');
var copy = require('metalsmith-copy');
var replace = require('metalsmith-replace');
var metallic = require('metalsmith-metallic');
var beautify  = require('metalsmith-beautify');
var moment = require('moment');
var strip = require('strip');
var truncate = require('truncate');
var templates  = require('metalsmith-templates');
var typogr = require('metalsmith-typogr');
var lazysizes = require('metalsmith-lazysizes');
// metadata and structure
console.log('Loading metadata...');
var ignore      = require('metalsmith-ignore');
var branch  = require('metalsmith-branch');
var collections  = require('metalsmith-collections');
var permalinks  = require('metalsmith-permalinks');
var relative = require('metalsmith-relative');
var navigation = require('metalsmith-navigation');
var excerpts = require('metalsmith-excerpts');
// static file compilation
console.log('Loading static file compilation...');
var sass  = require('metalsmith-sass');
var concat = require('metalsmith-concat');
var uglify = require('metalsmith-uglify');
var autoprefixer = require('metalsmith-autoprefixer');
var uncss = require('metalsmith-uncss');
var cleanCSS = require('metalsmith-clean-css');
// utility
console.log('Loading utilities...');
var debug = require('metalsmith-debug');
var watch = require('metalsmith-watch');
var serve = require('metalsmith-serve');
// BOWER MANAGEMENT
var fs = require('fs');
var path = require('path');
var bowerFiles = require('bower-files')({
	overrides: {
		'bootstrap-sass-official': {
			"main": [
				"assets/javascripts/bootstrap/collapse.js",
				"assets/javascripts/bootstrap/dropdown.js",
				"assets/javascripts/bootstrap/transition.js",
			],
		},
		'bootswatch-sass': {
			main: './styles/bootstrap.scss',
		},
		'components-font-awesome': {
			"main": [
				// "scss/font-awesome.scss",
				"fonts/fontawesome-webfont.eot",
				"fonts/fontawesome-webfont.woff2",
				"fonts/fontawesome-webfont.woff",
				"fonts/fontawesome-webfont.ttf",
				"fonts/fontawesome-webfont.svg"
			]
		},
		'modernizr': {
			main: '../bower_componenents/modernizr/modernizr.js'
		}
	}
});
var bower = function(files, metalsmith, done) {
  var include;
  include = function(root, included) {
	var contents, file, i, len, results;
	results = [];
	for (i = 0, len = included.length; i < len; i++) {
	  file = included[i];
	  contents = fs.readFileSync(file);
	  results.push(files[root + "/" + (path.basename(file))] = {
		contents: contents
	  });
	}
	return results;
  };
  include('styles', bowerFiles.ext('css').files);
  include('styles', bowerFiles.ext('scss').files);
  include('scripts', bowerFiles.ext('js').files);
  include('fonts', bowerFiles.ext(['eot', 'otf', 'ttf', 'woff','woff2']).files);
  return done();
};

// TEMPLATING HELPER
var addTemplate = function(config) {
    return function(files, metalsmith, done) {
    	var collections, collection;
        for (var file in files) {
        	collections = files[file].collection;
            for (var i = 0; i < collections.length; i++) {
            	collection = collections[i];
	            if (Object.keys(config).indexOf(collection)!==-1) {
	                var _f = files[file];
	                if (!_f.template) {
	                    _f.template = config[collection].template;
	                }
	                break;
	            }
            }
        }
        done();
    };
};

// LOG FILES
var logFilesMap = function(files, metalsmith, done) {
	Object.keys(files).forEach(function (file) {
		if(file.search('css'))
		console.log(">> ", file);
	});
	done();
};
// SEND CONSOLE MESSAGES
var logMessage = function(message){
	console.log('-',message+'...');
	return function(files, metalsmith, done){
		done();
	}
}


// ENVIRONMENT VARS - default to development
var ENVIRONMENT = process.env.ENV ? process.env.ENV : 'development';


// START THE BUILD!
console.log('Building...')
var colophonemes = new Metalsmith(__dirname);

colophonemes
	.use(logMessage('ENVIRONMENT: ' + ENVIRONMENT))
	.use(logMessage('NODE VERSION: ' + process.version))
	.source('./src')
	.destination('./dest')
	.use(debug())
	.use(ignore([
		'drafts/*',
		'**/.DS_Store',
		'styles/partials'
	]))
	// Set up some metadata
	.use(logMessage('Setting up metadata'))
	.use(metadata({
		"siteInfo": "settings/site-info.json"
	}))
	.use(function (files,metalsmith,done){
		// Prose can only save the menuOrder field as a string, which won't sort properly. This function converts it back to an integer
		Object.keys(files).forEach(function (file) {
			if(files[file].menuOrder){
				files[file].menuOrder = parseInt(files[file].menuOrder);
			}
		});
		done();
	})
	.use(collections({
		pages: {
			pattern: 'content/pages/**/*.md',
			sortBy: 'menuOrder',
			metadata: {
				singular: 'page',
			}
		}
	}))
	.use(filemetadata([
		{
			pattern:'content/pages/*.md',
			metadata: { 'topLevelPage' : true }
		},
		{
			pattern:'content/pages/*/*.md',
			metadata: { 'topLevelPage' : false }
		}
	]))
	.use(relative())
	// Build HTML files
	.use(logMessage('Building HTML files'))
	.use(function (files, metalsmith, done) {
		// Use the Remarkable parser to parse our Markdown files into HTML
		Remarkable = require('remarkable');
		cheerio = require('cheerio');
		Object.keys(files).forEach(function (file) {
			// look for markdown files
			if(file.substring(file.length-3,file.length)!=='.md') return false;
			// use remarkable to render MD
			md = new Remarkable({
				html: true,
				breaks: true,
				typographer: true,
				quotes: '“”‘’'
			});
			var html = md.render( files[file].contents.toString() );
			// use Cheerio to add img-responsive tags to our HTML
			$$ = cheerio.load(html);
			$$('img').addClass('img-responsive');
			html = $$.html();
			// save back to the main metalsmith array
			files[file].contents = html;
			var newFile = file.replace('.md','.html');
			files[newFile] = files[file];
			delete files[file];
		});	
		done();
	})
	.use(
		branch('content/pages/index*')
		.use(
			permalinks({
				pattern: './',
				relative: false				
			})
		)
	)	
	.use(
		branch('content/pages/!(index*)')
		.use(
			permalinks({
				pattern: ':title',
				relative: false				
			})
		)
	)
	.use(
		branch('content/pages/**/*')
		.use(function (files,metalsmith,done){
			Object.keys(files).forEach(function (file) {
				var parent  = path.dirname(file).replace('content/pages/','');
				files[file].parent = parent;
			});
			done();
		})
		.use(
			permalinks({
				pattern: ':parent/:title',
				relative: false				
			})
		)
	)
	.use(function (files,metalsmith,done){
		// add child pages to parent pages
		var childPages = metalsmith._metadata.collections.pages;
		for (var i = 0; i < childPages.length; i++) {
			var parent = childPages[i].parent;
			if(parent){
				var file = childPages[i];
				var parentPath = parent+'/index.html';
				files[parentPath].children = files[parentPath].children || [];
				files[parentPath].children.push(childPages[i]);
				childPages[i].bannerImage = childPages[i].bannerImage || files[parentPath].bannerImage;
			}
		};

		done();
	})
	.use(excerpts())
	.use(addTemplate({
		pages: {
			collection: 'pages',
			template: 'page.jade'
		}
	}))
	.use(templates({
		engine:'jade',
		moment: moment,
		strip: strip,
		truncate: truncate
	}))
	.use(function(files, metalsmith,done){
		// remove partial content from build chain
		var patterns = ['people','organisations'];
		var pattern = 'content/@('+patterns.join('|')+')/**';
		Object.keys(files).forEach(function(file){
			if(minimatch(file,pattern)){
				delete files[file];
			}
		})
		done();
	})
	.use(typogr())
	.use(lazysizes({
		pattern: [
			'images/*.@(jpg|jpeg|png|gif)',
			'images/!(favicons|logos)/*.@(jpg|jpeg|png|gif)'
		],
		sizes: [100,480,768,992,1200],
		backgrounds: ['#banner']
	}))
	// Build Javascript
	.use(logMessage('Building Javascript files'))
	.use(concat({
		files: 'scripts/!(lazysizes)/*.js',
		output: 'scripts/user.js'
	}))
	.use(bower)
	.use(concat({
		files: 'scripts/**/!(user|lazysizes).js',
		output: 'scripts/bower.js'
	}))
	.use(concat({
		files: ['scripts/lazysizes.js'],
		output: 'scripts/header.js'
	}))
	.use(concat({
		files: ['scripts/bower.js','scripts/user.js'],
		output: 'scripts/app.js'
	}))
	// Build CSS
	.use(logMessage('Building CSS files'))
	.use(sass())
	.use(autoprefixer())
	// stuff to only do in production
	if(ENVIRONMENT==='production'){
		colophonemes
		.use(logMessage('Cleaning CSS files'))
		.use(beautify({
			html: true,
			js: false,
			css: true,
			wrap_line_length: 50
		}))	
		.use(uncss({
			basepath: 'styles',
			css: ['app.css'],
			output: 'app.min.css',
			removeOriginal: true,
			uncss: {
				ignore: ['.collapse.in','.collapsing','.open','.open>.dropdown-menu'],
				media: ['(min-width: 480px)','(min-width: 768px)','(min-width: 992px)','(min-width: 1200px)']
			}
		}))
		.use(cleanCSS({
			cleanCSS : {
				keepBreaks: true,
				keepSpecialComments: false,
			}
		}))
		.use(uglify({
			removeOriginal: true
		}))
		;
	}
	// stuff to only do in development
	if(ENVIRONMENT==='development'){
		colophonemes
		.use(logMessage('Beautifying files'))
		// add '.min' to our asset filenames to match the HTML source
		.use(copy({
			pattern: '**/*.js',
			extension: '.min.js',
			move: true
		}))
		.use(copy({
			pattern: '**/*.css',
			extension: '.min.css',
			move: true
		}))
		// make the source code look nice
		.use(beautify({
			html: true,
			js: false,
			css: false,
			wrap_line_length: 80
		}))
		;
	}

	// Run build
	colophonemes.use(logMessage('Finalising build')).build(function(err,files){
		if(err){
			console.log('Errors:');
			console.log(err);
		}
		if(files){
			console.log('Build OK!');
		}
	} )
	;