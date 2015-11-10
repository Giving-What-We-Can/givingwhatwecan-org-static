// start a timer
var buildTime = process.hrtime();
var buildTimeDiff = buildTime;
// load environment variables
require('dotenv').load();
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
var MINIFY = args['--minify'] || args['--m'] ? true : false;
var CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
var CONTENTFUL_SPACE = process.env.CONTENTFUL_SPACE

// time requires
// require("time-require");
// cache require paths for faster builds
if(ENVIRONMENT==='development'){
    require('cache-require-paths');
}


// Start the build!
var chalk = require('chalk');
message('Generating the Giving What We Can site!',chalk.green,true);
message('Initialising new build...',chalk.dim,true);
// Metalsmith
var Metalsmith = require('metalsmith');
message('Loaded Metalsmith');
// templating
var metadata = require('metalsmith-metadata');
var getStats = require('./lib/get-stats')
var getSpecials = require('./lib/get-specials')
var contentful = require('contentful-metalsmith');
var slug = require('slug'); slug.defaults.mode = 'rfc3986';
var filemetadata = require('metalsmith-filemetadata');
var copy = require('metalsmith-copy');
var replace = require('metalsmith-replace');
var beautify  = require('metalsmith-beautify');
var moment = require('moment');
var strip = require('strip');
var truncate = require('truncate');
var inPlace  = require('metalsmith-in-place');
var templates  = require('metalsmith-templates');
var typogr = require('typogr');
var sizeOf = require('image-size');
message('Loaded templating');
// var lazysizes = require('metalsmith-lazysizes');
// metadata and structure
var ignore      = require('metalsmith-ignore');
var branch  = require('metalsmith-branch');
var collections  = require('metalsmith-collections');
var permalinks  = require('metalsmith-permalinks');
var relative = require('metalsmith-relative');
var navigation = require('metalsmith-navigation');
var excerpts = require('metalsmith-excerpts');
var pagination = require('metalsmith-pagination');
message('Loaded metadata');
// static file compilation
var swig = require('swig');
require('./lib/swig-filters')(swig);
// var marked = require('marked')
var MarkdownIt = require('markdown-it')
var MarkdownItFootnote = require('markdown-it-footnote');
// var MarkdownItSub = require('markdown-it-sub');
// var MarkdownItSup = require('markdown-it-sup');
var cheerio = require('cheerio');
var sass  = require('metalsmith-sass');
var concat = require('metalsmith-concat');
var autoprefixer = require('metalsmith-autoprefixer');
var browserify = require('browserify')
var icons = require('metalsmith-icons');
var feed = require('metalsmith-feed');
var htmlMinifier = require("metalsmith-html-minifier");
// only require in production
if(ENVIRONMENT==='production'){
    var uglify = require('metalsmith-uglify');
    var cleanCSS = require('metalsmith-clean-css');
    var uncss = require('metalsmith-uncss');
    // var subset = require('metalsmith-subsetfonts')
}
message('Loaded static file compilation');
// utility
var fs = require('fs');
var path = require('path');
var each = require('async').each;
var merge = require('merge');
var NotificationCenter = require('node-notifier').NotificationCenter;
var notifier = new NotificationCenter;
var prompt = require('prompt')
var YAML = require('yamljs')
message('Loaded utilities...');
// var debug = require('debug')('build');
message('All dependencies loaded!',chalk.cyan);

// call the master build function
build(1);


//
function build(buildCount){
    buildCount = buildCount || 1;
    if(buildCount>1){
        buildTime = process.hrtime();
        buildTimeDiff = buildTime;
        return;
    }
    // START THE BUILD!
    var colophonemes = new Metalsmith(__dirname);
    colophonemes
    .use(logMessage('ENVIRONMENT: ' + ENVIRONMENT,chalk.dim,true))
    .use(logMessage('NODE VERSION: ' + process.version,chalk.dim,true))
    .use(logMessage('BUILD TIME: ' + moment().format('YYYY-MM-DD @ H:m'),chalk.dim,true))
    .source('./src')
    .destination('./dest')
    .use(ignore([
        'scripts/!(includes)/*',
        '**/.DS_Store',
        'styles/partials/**'
    ]))
    // Set up some metadata
    .use(metadata({
        "siteInfo": "settings/site-info.json"
    }))
    .use(getStats({
        forceCache: ENVIRONMENT === 'development' ? true : false
    }))
    .use(getSpecials())
    .use(function (files,metalsmith,done){
        // hack to make metalsmith-feed plugin work by adding site.url to the metadata
        var meta = metalsmith.metadata();
        meta.site = {
            'url': meta.siteInfo.protocol + meta.siteInfo.domain
        }
        done();
    })
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
    .use(logMessage('Prepared global metadata'))
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
    .use(logMessage('Downloaded content from Contentful'))
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
                if(['body','bio'].indexOf(key)===-1){
                    meta[key] = meta.data.fields[key]
                } else {
                    meta['contents'] = meta.data.fields[key]
                }
                cb();
            }, cb)
        }, done)
    })
    .use(function (files,metalsmith,done){
        // remove templates from content blocks
        each(Object.keys(files).filter(minimatch.filter('@(content-block)/**/*.html')), function(file,cb){
            var meta = files[file]
            if (meta.template) delete meta.template;
            cb();
        },done)
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
                var menu = traverse(meta.data,[],1)[0]._children;
                menus[meta.id] = menu
            }
            delete files[file];
            cb();
        }
        function traverse(menu,a,depth){
            if(!menu.fields || depth > 3){
                return;
            }
            if(menu.fields.children){
                depth++
                var c = [];
                menu.fields.children.forEach(function(child){
                    var page = getFile(child)
                    if (page) {
                        c.push({_page:page})
                    }
                    else if (child.fields && child.fields.linkURL) {
                        c.push({_link:child.fields})
                    }
                    traverse(child,c,depth)
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
    .use(logMessage('Processed Contentful metadata'))
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
    .use(logMessage('Prepared blog posts'))
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
    .use(logMessage('Added files to collections'))
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
    .use(logMessage('Added navigation metadata'))
    
    /*.use(function (files,metalsmith,done){
        // create a menu hierarchy
        var nav = {};
        // go through files
        each(Object.keys(files).filter(minimatch.filter('@(page)/** /*.html')), getNavPosition , function(){
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
    .use(logMessage('Built navigation'))*/
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
    // .use(function (files,metalsmith,done){
    //     // move the contentful 'fields' metadata to the file's global meta
    //     each(Object.keys(files).filter(minimatch.filter('@(content-block)/**/*.html')), function(file,cb){
    //         var meta = files[file]
    //         console.log(meta)
    //         cb();
    //     },done)
    // })
    .use(logMessage('Moved files into place'))
    .use(function (files, metalsmith, done) {
        var dynamicSiteRedirects = files['settings/_redirects'].contents.toString().split('\n').sort()

        // build a list of redirects from file meta
        var metadata =metalsmith.metadata();
        var redirects = {};
        var redirectsFile = [];
        Object.keys(files).forEach(function (file) {
            if(files[file].hasOwnProperty('redirects')){
                files[file].redirects.forEach(function(redirect){
                    if(redirect !== '/'+files[file].path){
                        redirects[redirect] = files[file];
                        redirectsFile.push(redirect + ' /' + files[file].path + ' 302')
                    }
                })
            }
        })

        // inject the list of redirects into the global metadata
        metadata.redirects = redirects;

        // create a _redirects file for Netlify
        redirectsFile.sort();
        dynamicSiteRedirects.sort();
        redirectsFile = redirectsFile.concat(dynamicSiteRedirects);
        files['_redirects'] = {contents:redirectsFile.join('\n')};

        // create a list of rewrite rules for Drupal
        var htaccess = [];  
        Object.keys(files).forEach(function(file){
            var p = files[file].path;
            if(p) {
                p = p === '.' ? '/' : '/'+p; 
                htaccess.push('  RewriteRule ^'+p+'$ http://www1.givingwhatwecan.org'+p+' [R=302,L,NC]')
            }
        });
        htaccess.sort();
        files['htaccess'] = {contents:htaccess.join('\n')};
        done();
    })
    .use(logMessage('Calculated redirects'))   
    // Build HTML files
    .use(function (files, metalsmith, done) {
        var debug = require('debug')('parseMarkdown');


        // get our list of redirects for use later
        var metadata =metalsmith.metadata();
        var redirects = Object.keys(metadata.redirects);

        // call the parse function asynchronously
        each(Object.keys(files).filter(minimatch.filter('**/*.html')), parse, done )

        // function for parsing markdown into HTML, which also applies some additional transforms
        function parse (file, cb) {
            debug('%s — Building HTML from Markdown',file);
            
            var md = new MarkdownIt({
                html:true
            })
            .use(MarkdownItFootnote);

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
                        return $('<div class="row" />').append($('<figure class="col-xs-12" />').append($(this).contents()));
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
            /*$('p, h1, h2, h3, h4, h5, h6').each(function(){
                var el = $(this);
                el.html(typogr.typogrify(el.html()));
            })*/
            // use our global list of redirects to resolve any outdated internal links in the body (only bother in production)
            if(ENVIRONMENT === 'production'){
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
            }
            html = $.html();
            debug('Rendered HTML from cheerio');
            // save back to the main metalsmith array
            files[file].contents = html;
            debug('%s – Saved file',file);
            cb();
        } 
    })
    .use(logMessage('Converted Markdown to HTML'))
    .use(excerpts())
    .use(relative())
    .use(feed({
        collection: 'posts',
        destination: 'blog.xml'
    }))
    .use(logMessage('Generated RSS feed'))
    .use(templates({
        engine:'swig',
        requires: {swig:swig},
        moment: moment,
        strip: strip,
        truncate: truncate,
        pattern: "**/*.html",
        inPlace: true
    }))
    .use(templates({
        engine:'swig',
        requires: {swig:swig},
        moment: moment,
        strip: strip,
        truncate: truncate,
        directory: 'templates'
    }))
    .use(logMessage('Built HTML files from templates'))
    .use(icons({
        sets:       {   fa:'fontawesome'},
        fontDir:    'fonts',
        customIcons: 'fonts/glyphs.json'
    }))
    .use(logMessage('Added icon fonts'))
    .use(function (files, metalsmith, done) {
        // we've incorporated content blocks into other pages, but we don't need them as standalone pages in our final build.
        Object.keys(files).forEach(function(file){
            if(minimatch(file,'content-block/**')){
                delete files[file];
            }
        });
        done();
    })
    ;
    // build responsive images at this point if we're in production
    if(ENVIRONMENT==='production'){
       /* colophonemes
        .use(lazysizes({
            pattern: [
                'images/*.@(jpg|jpeg|png|gif)',
                'images/!(favicons|logos)/*.@(jpg|jpeg|png|gif)'
            ],
            sizes: [100,480,768,992,1200],
            backgrounds: ['#banner']
        }))*/
    }
    // Build Javascript
    colophonemes
    .use(function (files,metalsmith,done){
        // Bundle our javascript files using browserify
        
        // the filename of our entry script, relative to the Metalsmith source directory
        var filePath = 'scripts/entry.js';
        // the output filename of our bundle
        var outFilePath = 'scripts/app.js';
        // the output filename of our sourcemap
        var mapFilePath = 'scripts/app.map.json';
        // get an absolute path to the file — browserify won't accept a buffer from Metalsmith's virtual file system
        var entryFile  = path.join(metalsmith.source(),filePath);
        // turn minification on or off
        var minify = ENVIRONMENT ==='production' ? true : false;
        // start browserify
        var b = new browserify({debug:true});
        // add the entry file to the queue
        b.add(entryFile)
        // add minifier / sourcemap generator
        b.plugin('minifyify', {map: '/'+mapFilePath, minify:minify}); 
        // call the main bundle function
        b.bundle(function(err, src, map){
            if(err) throw err;
             if(minify){
                files[outFilePath.replace('.js','.min.js')] = {contents: src, mode: 0664 }
                files[mapFilePath] = {contents: map, mode: 0664 }
             } else {
                files[outFilePath] = {contents: src, mode: 0664 }
             }
             done();
        })
    })
    .use(logMessage('Bundled Javascript files'))
    ;
    // Build CSS
    if(ENVIRONMENT === 'development'){
        colophonemes
        .use(sass({
            outputStyle: 'nested'
        }))
    } else {
        colophonemes
        .use(sass())
    }
    colophonemes
    .use(concat({
        files: ['styles/styles.css','styles/icons.css'],
        output: 'styles/app.css'
    }))
    .use(autoprefixer())
    .use(logMessage('Built CSS files'))
    ;
    // stuff to only do in production
    if(ENVIRONMENT==='production'){
        colophonemes
        .use(htmlMinifier())
        .use(logMessage('Cleaning CSS files'),chalk.yellow)
        .use(uncss({
            basepath: 'styles',
            css: ['app.css'],
            output: 'app.min.css',
            removeOriginal: true,
            uncss: {
                ignore: [
                    /collaps/,
                    /nav/,
                    /dropdown/,
                    /modal/,
                    /.fade/,
                    /.in/,
                    /.open/,
                    /ct-/,
                    /slider/,
                    '.loader',
                    '.transparent',
                    /slabtext/,
                    /lazyload/,
                ],
                media: ['(min-width: 480px)','(min-width: 768px)','(min-width: 992px)','(min-width: 1200px)']
            }
        }))
        .use(cleanCSS({
            cleanCSS : {
                keepBreaks: true,
                keepSpecialComments: false,
            }
        }))
        .use(logMessage('Cleaned CSS files'))
        .use(uglify({
            removeOriginal: true,
            filter: "scripts/includes/**/*"
        }))
        .use(logMessage('Minified Javascript'))
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
        
        if(MINIFY){
            colophonemes
            .use(logMessage('Minifying files'))
            // make the source code look bad
            .use(htmlMinifier())
            ;
        }
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
        var t = formatBuildTime(buildTime);
        if(err){
            console.log('Build Failed!','(Build time: ' + t + ')');
            console.log('Errors:');
            console.trace(err);
            if(ENVIRONMENT==='development'){
                notifier.notify({
                    title: 'Build failed!',
                    message: err,
                    appIcon: '',
                    contentImage: path.join(__dirname, 'src', 'images','favicons', 'favicon-96x96.png'), // absolute path (not balloons) 
                    sound: 'Funk',
                    activate: 'com.apple.Terminal'
                })
            }
        }
        if(files){
            
            console.log('Build OK!','(Build time: ' + t + ')');
            if(ENVIRONMENT==='development'){
                notifier.notify({
                    title: 'Website built!',
                    message:'Build time: '+t+'\nClick to switch to Chrome',
                    appIcon: '',
                    contentImage: path.join(__dirname, 'src', 'images','favicons', 'favicon-96x96.png'), // absolute path (not balloons) 
                    sound: 'Glass',
                    activate: 'com.google.Chrome'
                })
                // keep the process running so we don't have to recompile dependencies on subsequent builds...
                /*prompt.start()
                prompt.message = "Build again?"
                try {
                    prompt.get(['response'],function(err,results){
                        if(err) throw new Error (err);
                        if(results.response.toLowerCase()==='n' || results.response.toLowerCase()==='n'){
                            if(err) throw new Error (err);
                        }
                        build(buildCount+1);
                    });
                } catch(e){
                    console.log('Exiting...')
                }*/
            }
        }
    } )
    ;
}




// UTILITIES //

// LOG FILES
function logFilesMap (files, metalsmith, done) {
    Object.keys(files).forEach(function (file) {
        if(file.search('css'))
        console.log(">> ", file);
    });
    done();
};
// SEND CONSOLE MESSAGES
function message(m,c,t){
    c = c||chalk.yellow.bold
    t = t||false;
    var output = c(m);
    if(!t) {
        output += '................................................'.substr(m.length)
        output += chalk.dim('(+'+formatBuildTimeDiff()+' / '+formatBuildTime()+')')
    }
    console.log('-',output);
}
function logMessage (m,c,t){
    c = c ||chalk.bold.blue
    return function(files, metalsmith, done){
        message(m,c,t)
        done();
    }
}
// FORMAT BUILD TIMER INTO Mins : secs . milliseconds
function formatBuildTime(hrTimeObj){
    hrTimeObj = hrTimeObj || buildTime
    var t = process.hrtime(hrTimeObj)
    return (t[0] + (t[1]/10e+9)).toFixed(3)+'s';
}
function formatBuildTimeDiff(){
    var t = buildTimeDiff;
    buildTimeDiff = process.hrtime();
    return formatBuildTime(t);
}



// TEMPLATING HELPER
function addTemplate (config) {
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