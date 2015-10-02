// load environment variables
require('dotenv').load();
// Start the build!
console.log('\nGenerating the Giving What We Can site!\n');
console.log('Initialising new build...');
console.log('Loading Metalsmith...');
// Metalsmith
var Metalsmith = require('metalsmith');
// templating
console.log('Loading templating...');
var metadata = require('metalsmith-metadata');
var contentful = require('contentful-metalsmith');
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
var each = require('async').each;
var merge = require('merge');
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
        },
        'waypoints': {
            main: 'lib/jquery.waypoints.js'
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
var CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
var CONTENTFUL_SPACE = process.env.CONTENTFUL_SPACE


// START THE BUILD!
console.log('Building...')
var colophonemes = new Metalsmith(__dirname);
colophonemes
    .use(logMessage('ENVIRONMENT: ' + ENVIRONMENT))
    .use(logMessage('NODE VERSION: ' + process.version))
    .use(logMessage('BUILD TIME: ' + moment().format('YYYY-MM-DD @ H:m')))
    .source('./src')
    .destination('./dest')
    .use(ignore([
        'drafts/*',
        '**/.DS_Store',
        'styles/partials/**'
    ]))
    // Set up some metadata
    .use(logMessage('Preparing global metadata'))
    .use(metadata({
        "siteInfo": "settings/site-info.json",
    }))
    .use(function (files,metalsmith,done){
        // add defaults to all our contentful source files
        var options = {
            space_id: CONTENTFUL_SPACE,
            limit: 2000,
            permalink_style: true
        }
        each(Object.keys(files), apply , done)

        function apply (file, cb) {
            var meta = files[file];
            if(!meta.contentful) {cb(); return;}
            meta.contentful = merge(true,options,meta.contentful)
            cb();
        }
    })
    .use(logMessage('Downloading content from Contentful'))
    .use(contentful({ "accessToken" : CONTENTFUL_ACCESS_TOKEN } ))
    .use(function (files,metalsmith,done){
        // get rid of the contentful source files from the build
        each(Object.keys(files), function(file,cb){
            if(minimatch(file,'contentful/**')){
                delete files[file];
            }
            cb();
        } , done)
    })
    .use(function (files,metalsmith,done){
        // fix weird situation where contentful adds a double slash to the index page if the slug is set as '/'
        if(files['page//index.html']){
            files['page/index.html'] = files['page//index.html'];
            delete files['page//index.html'];
        }
        done();
    })
    .use(function (files,metalsmith,done){
        // move the contentful 'fields' metadata to the file's global meta
        each(Object.keys(files).filter(minimatch.filter('**/*.html')), function(file,cb){
            var meta = files[file]
            if(!meta.data || !meta.data.fields){ cb(); return; }
            each(Object.keys(meta.data.fields), function(key,cb){
                if(key!=='body'){
                    meta[key] = meta.data.fields[key]
                } else {
                    meta['contents'] = new Buffer(meta.data.fields.body);
                }
                cb();
            }, cb)
        }, done)
    })
    .use(function (files,metalsmith,done){
        // add any menus to the global metadata, and get rid of the source files
        var menus = {};
        each(Object.keys(files).filter(minimatch.filter('@(menu)/**/*.html')),apply, function(){
            var metadata = metalsmith.metadata();
            metadata.menus = menus;
            done();            
        })

        function apply (file,cb){
            var meta = files[file]
            if(meta.topLevelMenu){
                var menu = traverse(meta.data,[])[0]._children;
                menus[meta.id] = menu
            }
            delete files[file];
            cb();
        }
        function traverse(menu,a){
            if(menu.fields.children){
                var c = [];
                menu.fields.children.forEach(function(child){
                    var page = getFile(child)
                    if (page) c.push({_page:page})
                    traverse(child,c)
                })
                a.push({_menu:menu,_children:c})
            }
            return a
        }
        function getFile(menu){
            var found = false;
            Object.keys(files).forEach(function(file){
                if(files[file].id === menu.sys.id){
                    found = file;
                }
            })
            return found ? files[found] : false;
        }

    })
    .use(logMessage('Preparing blog posts'))
    .use(collections({
        // just add the posts to the collection, so that we can add the blog archive pages to the 'pages' collection after the 'paginate' plugin runs
        posts: {
            pattern: 'post/**/*.html',
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
            first: 'blog/index.html',
            path: 'blog/page/:num/index.html',
            pageMetadata: {
              title: 'Blog',

            }
        }
    }))
    .use(function (files, metalsmith, done) {
        // get rid of the 'post' collections in the global metadata so that we can create clean collections when we index the rest of the content
        var metadata = metalsmith.metadata();
        delete metadata.collections;
        delete metadata.posts;
        each(Object.keys(files), apply , done)
        function apply (file, cb) {
            delete files[file].collection;
            cb();
        }
    })
    .use(logMessage('Adding files to collections'))
    .use(collections({
        // just add the posts to the collection, so that we can add the blog archive pages to the 'pages' collection after the 'paginate' plugin runs
        pages: {
            pattern: 'page/**/*.html',
            sortBy: 'menuOrder',
            metadata: {
                singular: 'page',
            }
        },
        blogs: {
            pattern: 'blog/**/*.html',
            sortBy: 'menuOrder',
            metadata: {
                singular: 'blog',
            }
        },
        authors: {
            pattern: 'author/**/*.html',
            sortBy: 'name',
            metadata: {
                singular: 'author',
            }
        },
        posts: {
            pattern: 'post/**/*.html',
            sortBy: 'date',
            reverse: true,
            metadata: {
                singular: 'post',
            }
        },
        contentBlocks: {
            pattern: 'content-block/**/*.html',
            sortBy: 'menuOrder',
            reverse: false,
            metadata: {
                singular: 'content-block',
            }
        }
    }))
    .use(logMessage('Adding navigation metadata'))
    .use(function (files, metalsmith, done) {
        // check all of our HTML files have slugs
        each(Object.keys(files).filter(minimatch.filter('@(page)/**/*.html')), apply, done )

        function apply (file, cb) {
            meta = files[file];
            // add a slug
            if(!meta.slug) {
                if (meta.title) {
                    meta.slug = slug(meta.title)
                }
                else if (meta.name) {
                    meta.slug = slug(meta.name)
                } else {
                    throw new Error ('Could not set slug for file ' + file)
                }
            }
            cb();
        }
    })

    .use(function (files, metalsmith, done) {
        // add parents to pages if needed 
        each(Object.keys(files).filter(minimatch.filter('@(page)/**/*.html')), apply, done )
        // recursively find parent links
        function apply(file, cb){
            files[file].breadcrumbs = files[file].parent ? getParent(files[file].parent,[files[file].slug]) : [files[file].slug];
            files[file].path = files[file].slug !== '/' ? files[file].breadcrumbs.join('/') : '.';
            cb();
        }
        function getParent(parent, path){
            path = path || [];
            if(!parent.fields.slug) throw new Error('Parent has no slug!' + parent.sys.id)
            path.unshift(parent.fields.slug)
            if(parent.fields.parent){
                return getParent(parent.fields.parent,path)
            } else {
                return path;
            }
        }
    })
    .use(function (files,metalsmith,done){
        // add paths to authors 
        each(Object.keys(files).filter(minimatch.filter('@(author)/**/*.html')), apply, done )
        // recursively find parent links
        function apply(file, cb){
            var authorPath = 'author'
            files[file].breadcrumbs = [authorPath, files[file].slug]
            files[file].path = files[file].breadcrumbs.join('/')
            cb();
        }
    })
    .use(function (files,metalsmith,done){
        // set a nice path for blog posts
        each(Object.keys(files).filter(minimatch.filter('@(post)/**/*.html')), apply, done )
        function apply(file, cb){
            var date = moment(files[file].date,moment.ISO_8601).format('YYYY/MM');
            var filepath = 'post/'+date+'/'+files[file].slug
            // add the path to the files metadata
            files[file].path = filepath;
            cb();
        }
    })
    
    .use(logMessage('Building navigation'))
    .use(function (files,metalsmith,done){
        // create a menu hierarchy
        var nav = {};
        // go through files
        each(Object.keys(files).filter(minimatch.filter('@(page)/**/*.html')), getNavPosition , function(){
            var metadata = metalsmith.metadata()
            sortNavItems(nav)
            nav._sorted = Object.keys(nav);
            nav._sorted.sort()
            nav._sorted.sort(function(a,b){
                // sort by menuOrder
                var x = nav[a]._data.menuOrder
                var y = nav[b]._data.menuOrder
                x = typeof x === 'number' ? x : 100;
                y = typeof y === 'number' ? y : 100;

                if (y < x){
                    return 1
                } else if (y > x){
                    return -1
                }
                return 0;
            })
            metadata['nav'] = nav;
            done();
        })
        function getNavPosition(file, cb){
            var meta = files[file];
            createNestedObject(nav,files[file].breadcrumbs);
            cb();
            function createNestedObject ( base, names ) {
                var i = names[0]
                base[i] = base[i] || {};
                if(names.length>1){
                    base[i]._children = base[i]._children || {}
                    createNestedObject(base[i]._children,names.slice(1))
                } else {
                    base[i]._data = meta
                }
            };
        }
        function sortNavItems(base){
            // add a '_sorted' field to each node of the nav, so that we can get things in order if needed
            Object.keys(base).forEach(function(key){
                var c = base[key]
                if(c._children){
                    c._sorted = Object.keys(c._children);
                    c._sorted.sort(); // sort alphabetically
                    c._sorted.sort(function(a,b){
                        // sort by menuOrder
                        var x = c._children[a]._data.menuOrder
                        var y = c._children[b]._data.menuOrder
                        x = typeof x === 'number' ? x : 100;
                        y = typeof y === 'number' ? y : 100;

                        if (y < x){
                            return 1
                        } else if (y > x){
                            return -1
                        }
                        return 0;
                    })
                    sortNavItems(c._children);
                }
            })
        }     
    })
    .use(function (files,metalsmith,done){
        // move files so that their location matches their path
        each(Object.keys(files).filter(minimatch.filter('**/*.html')), apply, done )
        function apply(file, cb){
            var filepath = files[file].path
            if(filepath){
                if(typeof filepath !== 'string'){
                    throw new Error ('File path should be a string ' + file)
                }
                // normalize paths by getting rid of index.html
                var index = /\/index\.html$/
                if(index.test(filepath)){
                    filepath = filepath.replace(index,'')
                    files[file].path = filepath;
                }
                if(filepath + '/index.html' !== file){
                    files[path.join(filepath!=='.'?filepath:'','index.html')] = files[file];
                    delete files[file];
                }
            }
            cb();
        }
    })
    // Build HTML files
    .use(logMessage('Converting Markdown to HTML'))
    .use(function (files, metalsmith, done) {
        var debug = require('debug')('parseMarkdown');
        // Use the Remarkable parser to parse our Markdown files into HTML
        Remarkable = require('remarkable');
        cheerio = require('cheerio');

        each(Object.keys(files).filter(minimatch.filter('**/*.html')), parse, done )

        function parse (file, cb) {
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
            debug('%s – Saved file',file);
            cb();
        } 
    })
    // .use(
    //     branch('index.html')
    //     .use(
    //         permalinks({
    //             pattern: './',
    //             relative: false             
    //         })
    //     )
    // )
    // .use(
    //     branch('!(index).html')
    //     .use(
    //         permalinks({
    //             relative: false,
    //         })
    //     )
    // )
    // .use(
    //     branch('**/**/*.html}')
    //     .use(
    //         permalinks({
    //             relative: false,
    //         })
    //     )
    // )
    .use(excerpts())
    .use(logMessage('Building redirects'))
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
        // console.log(metadata.redirects)
        each(Object.keys(files).filter(minimatch.filter('**/*.html')), apply, done)
        function apply(file,cb){
            // load the HTML
            var $ = cheerio.load(files[file].contents);
            // look at every link
            $('a').each(function(){
                var a = $(this);
                var href = a.attr('href');
                if(href && href.length > 0){
                    // remove giving what we can domain
                    var gwwc = /^(http|https):\/\/givingwhatwecan.org(\/.+)/
                    if(gwwc.test(href)) href = href.match(gwwc)[2]
                    // if we have a match for this link in our redirects list, and it's different to the existing link, update it
                    if(redirects.indexOf(href) > -1 && '/'+metadata.redirects[href].path !== href){
                        a.attr('href','/'+metadata.redirects[href].path);
                    }
                }
            });    
            // save the modified HTML back to the file
            files[file].contents = $.html();
            cb();
        }                
 
        // done();
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
    // .use(function (files,metalsmith,done){
    //     each(Object.keys(files).filter(minimatch.filter('**/*.html')), apply )
    //     function apply(file, cb){
    //         if(files[file].navigation){
    //             console.log('File >>',file);
    //             console.log(files[file].navigation);
    //             console.log('-')
    //         }
    //         cb();
    //     }
    // })
    .use(function (files, metalsmith, done) {
        // we've incorporated content blocks into other pages, but we don't need them as standalone pages in our final build.
        Object.keys(files).forEach(function(file){
            if(minimatch(file,'content/content-blocks/**')){
                delete files[file];
            }
        });
        done();
    })
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
    colophonemes.use(logMessage('Finalising build')).build(function(err,files){
        if(err){
            console.log('Errors:');
            console.trace(err);
        }
        if(files){
            console.log('Build OK!');
        }
    } )
    ;