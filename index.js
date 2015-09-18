// Start the build!
console.log('\nGenerating the Giving What We Can site!\n');
console.log('Initialising new build...');
console.log('Loading Metalsmith...');
// Metalsmith
var Metalsmith = require('metalsmith');
// templating
console.log('Loading templating...');
var metadata = require('metalsmith-metadata');
var slug = require('slug'); slug.defaults.mode = 'rfc3986';
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
var sizeOf = require('image-size');
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
var pagination = require('metalsmith-pagination');
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
// var debug = require('debug')('build');

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
    var debug = require('debug')('addTemplate');
    return function(files, metalsmith, done) {
        var metadata = metalsmith.metadata();
        Object.keys(metadata.collections).forEach(function(collection){
            if (Object.keys(config).indexOf(collection)!==-1) {
                Object.keys(metadata.collections[collection]).forEach(function(i){
                    var file = metadata.collections[collection][i];
                    debug('Trying to add ' + config[collection].template + ' to ' + collection + ' file ' + (file.title || file.name) );
                    if (!file.template) {
                        file.template = config[collection].template;
                        debug('        Added ' + config[collection].template + ' to ' + collection + ' file ' + (file.title || file.name) );
                    }                    
                })
            }
            debug('Done '+collection);
        });
        debug('Done adding templates');
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
    return function(files, metalsmith, done){
        console.log('-',message+'...');
        done();
    }
}

// command-line args
var args = {};
process.argv.forEach(function (arg) {
    if(arg.indexOf('=')>-1){
        arg = arg.split('=');
        args[arg[0]] = arg[1];
    } else if(arg.substr(0,2)==='--'){
        args[arg] = true;
    }
});

// ENVIRONMENT VARS - default to development
var ENVIRONMENT = process.env.ENV ? process.env.ENV : 'development';
var BEAUTIFY = args['--beautify'] || args['--b'] ? true : false;


// START THE BUILD!
console.log('Building...')
var colophonemes = new Metalsmith(__dirname);

colophonemes
    .use(logMessage('ENVIRONMENT: ' + ENVIRONMENT))
    .use(logMessage('NODE VERSION: ' + process.version))
    .source('./src')
    .destination('./dest')
    .use(ignore([
        'drafts/*',
        '**/.DS_Store',
        'styles/partials'
    ]))
    // Set up some metadata
    .use(metadata({
        "siteInfo": "settings/site-info.json"
    }))
    .use(function (files,metalsmith,done){
        // The CMS can only save the menuOrder field as a string, which won't sort properly. This function converts it back to an integer
        Object.keys(files).forEach(function (file) {
            if(files[file].menuOrder){
                files[file].menuOrder = parseInt(files[file].menuOrder);
            }
        });
        done();
    })
    .use(logMessage('Preparing blog posts'))
    .use(collections({
        // just add the posts to the collection, so that we can add the blog archive pages to the 'pages' collection after the 'paginate' plugin runs
        posts: {
            pattern: 'content/posts/**/*.md',
            sortBy: 'date',
            reverse: true,
            metadata: {
                singular: 'post',
            }
        }
    }))
    .use(pagination({
        'collections.posts': {
            perPage: 10,
            template: 'blog.swig',
            first: 'blog.html',
            path: 'blog/page/:num.html',
            pageMetadata: {
              title: 'Blog',

            }
        }
    }))
    .use(function (files, metalsmith, done) {
        // get rid of the 'post' collections in the global metadata so that we can create clean collections when we index the rest of the content
        var metadata =metalsmith.metadata();
        delete metadata.collections;
        delete metadata.posts;
        Object.keys(files).forEach(function (file) {
            delete files[file].collection;
        })
        done();
    })
    .use(logMessage('Adding files to collections'))
    .use(collections({
        // just add the posts to the collection, so that we can add the blog archive pages to the 'pages' collection after the 'paginate' plugin runs
        pages: {
            pattern: '{content/pages/**/*.md,blog/**/*.html}',
            sortBy: 'menuOrder',
            metadata: {
                singular: 'page',
            }
        },
        authors: {
            pattern: 'content/authors/**/*.md',
            sortBy: 'name',
            metadata: {
                singular: 'author',
            }
        },
        posts: {
            pattern: 'content/posts/**/*.md',
            sortBy: 'date',
            reverse: true,
            metadata: {
                singular: 'post',
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
    .use(logMessage('Adding navigation metadata'))
    .use(function (files, metalsmith, done) {
        var debug = require('debug')('addSlugs');
        debug('Adding slugs to files');
        // add a slug to html files
        Object.keys(files).forEach(function (file) {
            if(minimatch(file,'**/*.md')){
                debug('Adding slug to %s',file);
                if(minimatch(file,'content/pages/index.md')){
                    files[file].slug = '/'
                }
                else if(files[file].title){
                    files[file].slug = slug( files[file].menuTitle ? files[file].menuTitle : files[file].title );
                } else if (files[file].name) {
                    files[file].slug = slug( files[file].name );
                } else {
                    console.error ('Cannot generate slug, file has no `title` or `name` attribute');
                    console.log(file)
                    console.log(files[file].contents.toString().substr(0,500));
                    console.log('File object has the following keys',Object.keys(files[file]));
                    delete files[file];
                }
                debug('File slug is %s',files[file].slug);
            }
        });
        done();
    })
    .use(function (files,metalsmith,done){
        var debug = require('debug')('setAuthorParents');
        debug('Setting default parents for authors');
        // set a default parent for all author pages
        Object.keys(files).forEach(function(file){
            if(minimatch(file,"content/authors/**/*.md")){
                debug('%s — added parent "authors"',file);
                files[file].parent = 'authors';
            }           
        });
        done();
    })
    .use(function (files,metalsmith,done){
        var debug = require('debug')('setBlogPathInfo');
        debug('Setting path info');
        // set a nice path for blog posts
        Object.keys(files).forEach(function(file){
            if(minimatch(file,"content/posts/**/*.md")){
                debug('%s — setting path info"',file);
                var date = moment(files[file].date,'YYYY-MM-DD').format('YYYY/MM');
                var filepath = 'posts/'+date+'/'+files[file].slug
                // add the path to the files metadata
                files[file].path = filepath;
                // move the post to the right location, and get rid of the original
                files[filepath+'.md'] = files[file];
                delete files[file];
                debug('%s — moved file"',file);
            }           
        });
        done();
    })
    .use(logMessage('Building navigation'))
    .use(function (files,metalsmith,done){
        var debug = require('debug')('createMenu');
        debug('Creating menu');
        // create a menu hierarchy
        var nav = {};
        var match = "content/@(authors|pages)/**/*.md";
        // go through files
        Object.keys(files).forEach(function(file){
            // match files
            if(minimatch(file,match)){ 
                // set variables for convenience
                var parent = files[file].parent;
                var slug = files[file].slug;
                var navigation = files[file].navigation;
                // if the file has a parent, add it to the appropriate place in the navigation
                if(parent){
                    debug('%s -- has a parent file',file);
                    // split the parent path up into folders
                    var breadcrumb = parent.split('/');
                    // function to recursively add elements to the nav structure
                    breadcrumb.reduce(function(parent, child, index) { 
                        parent.children = parent.children || {};
                        parent.children[child] = parent.children[child] || {}
                        // if this is the last element of the breadcrumb, add our child page here
                        if(index === breadcrumb.length-1){ 
                            parent.children[child].childPages = parent.children[child].childPages || {}
                            parent.children[child].childPages[slug] = files[file];
                            // if we're only one level down, check whether there should be a heading for this page's parent in the menu
                            if(breadcrumb.length===1 && files[file].navigation){
                                // step through each menu that this file should appear in
                                navigation.forEach(function(menu){
                                    nav.menus = nav.menus || {};
                                    // ensure that the parent menu item that this file is a child of appears in this particular menu
                                    if(nav.menus.hasOwnProperty(menu) && nav.menus[menu].indexOf(child)===-1){
                                        nav.menus[menu].push(child);
                                    } else if (!nav.menus[menu]) {
                                        nav.menus[menu] = [child];
                                    }
                                });
                            }
                        } 
                        return parent.children[child];
                    }, nav);
                    // make sure that the file's path is correct
                    files[file].path = parent + '/' + slug;


                // otherwise, if there's no parent, add it as a child of the top level of the menu    
                } else {  
                    debug('%s -- has no parent file',file);      
                    if(!files[file].slug) throw new Error(files[file].title + 'has no slug')
                    nav.childPages = nav.childPages || {};
                    nav.childPages[slug] = files[file];
                    // make sure that the file's path is correct
                    files[file].path = slug;
                }
                // make sure the file builds at the proper path, ensuring that the index remains the index
                filepath = files[file].path !== '/' ? files[file].path+'.md' : 'index.md';
                if(filepath !== file){
                    files[filepath] = files[file];
                    delete files[file];
                }

            }
        });
        var metadata = metalsmith.metadata()
        metadata['navMenus'] = nav;
        done();
    })
    .use(logMessage('Adding templating metadata'))    
    .use(addTemplate({
        pages: {
            collection: 'pages',
            template: 'page.swig'
        },
        authors: {
            collection: 'authors',
            template: 'author.swig'
        },
        posts: {
            collection: 'posts',
            template: 'post.swig'
        }
    }))
    // Build HTML files
    .use(logMessage('Converting Markdown to HTML'))
    .use(function (files, metalsmith, done) {
        var debug = require('debug')('parseMarkdown');
        // Use the Remarkable parser to parse our Markdown files into HTML
        Remarkable = require('remarkable');
        cheerio = require('cheerio');
        Object.keys(files).forEach(function (file) {
            // look for markdown files
            if(file.substring(file.length-3,file.length)!=='.md') return false;
            // use remarkable to render MD
            debug('%s — Building HTML from Markdown',file);
            md = new Remarkable({
                html: true,
                breaks: true,
                typographer: true,
                quotes: '“”‘’'
            });
            var html = md.render( files[file].contents.toString() );
            debug('%s — Rendered markdown',file);
            // use Cheerio to modify HTML
            debug('%s — Using Cheerio to modify file contents',file);
            $ = cheerio.load(html);
            $('img').each(function(){
                var img = $(this);
                // wrap images that are in p tags in figures instead
                var parent = img.parent();
                if(parent[0] && parent[0].name === 'p'){
                    parent.replaceWith(function(){
                        return $("<div />").addClass('row').append($("<figure />").append($(this).contents()));
                    })
                    // check the size of our images, if they're not big enough, make them half-size 
                    var imgFile = files[img.attr('src').substr(1)];
                    if(imgFile){
                        if(sizeOf(imgFile.contents).width<750){
                            img.parent('figure').addClass('col-md-6 col-md-offset-3');
                        } else {
                            img.parent('figure').addClass('col-xs-12');
                        }
                    }
                }
                // add img-responsive tags to images
                img.addClass('img-responsive');
            })
            html = $.html();
            debug('Rendered HTML from cheerio');
            // save back to the main metalsmith array
            files[file].contents = html;
            var newFile = file.replace('.md','.html');
            files[newFile] = files[file];
            delete files[file];
            debug('%s – Saved file',newFile);
        }); 
        done();
    })
    .use(
        branch('index.html')
        .use(
            permalinks({
                pattern: './',
                relative: false             
            })
        )
    )
    .use(
        branch('!(index).html')
        .use(
            permalinks({
                relative: false,
            })
        )
    )
    .use(
        branch('{**/**/*.html}')
        .use(
            permalinks({
                relative: false,
            })
        )
    )
    .use(excerpts())
    .use(logMessage('Building redirects...'))
    .use(function (files, metalsmith, done) {
        // inject a list of redirects into the global metadata
        var metadata =metalsmith.metadata();
        var redirects = {};
        Object.keys(files).forEach(function (file) {
            if(files[file].hasOwnProperty('redirects')){
                files[file].redirects.forEach(function(redirect){
                    redirects[redirect] = files[file];
                })
            }
        })
        metadata.redirects = redirects;
        done();
    })
    .use(function (files, metalsmith, done) {
        // use our list of redirects to amend any broken internal links
        var metadata =metalsmith.metadata();
        // get our list of redirects
        var redirects = Object.keys(metadata.redirects);
        // console.log(redirects);
        Object.keys(files).forEach(function (file) {
            // look in each HTML file
            if(minimatch(file,'**/*.html')){
                // load the HTML
                var $ = cheerio.load(files[file].contents);
                // look at every link
                $('a').each(function(){
                    var a = $(this);
                    var href = a.attr('href');
                    if(href && href.length > 0){
                        // remove trailing slashes if they exist
                        if(href.substr(0,1)==='/') href = href.substr(1);
                        // if we have a match for this link in our redirects list, and it's different to the existing link, update it
                        if(redirects.indexOf(href) > -1 && metadata.redirects[href].path !== href){
                            a.attr('href','/'+metadata.redirects[href].path);
                        }
                    }
                });    
                // save the modified HTML back to the file
                files[file].contents = $.html();
                
            }
        })
        done();
    })
    .use(logMessage('Building HTML files from templates'))
    .use(relative())
    .use(templates({
        engine:'swig',
        moment: moment,
        strip: strip,
        truncate: truncate,
        directory: 'templates'
    }))
    .use(typogr())
    ;
    // build responsive images at this point if we're in production
    if(ENVIRONMENT==='production'){
        colophonemes
        .use(lazysizes({
            pattern: [
                'images/*.@(jpg|jpeg|png|gif)',
                'images/!(favicons|logos)/*.@(jpg|jpeg|png|gif)'
            ],
            sizes: [100,480,768,992,1200],
            backgrounds: ['#banner']
        }))
    }
    // Build Javascript
    colophonemes
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
    ;
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
        ;
        if(BEAUTIFY){
            colophonemes
            .use(logMessage('Beautifying files'))
            // make the source code look nice
            .use(beautify({
                html: true,
                js: false,
                css: false,
                wrap_line_length: 80
            }))
            ;
        }

    }

    // Run build
    colophonemes.use(logMessage('Finalising build...')).build(function(err,files){
        if(err){
            console.log('Errors:');
            console.trace(err);
        }
        if(files){
            console.log('Build OK!');
        }
    } )
    ;