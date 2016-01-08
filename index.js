// start a timer
var buildTime = process.hrtime();
var buildTimeDiff = buildTime;
// load environment variables
require('dotenv').load({silent: true});
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

if(ENVIRONMENT==='development'){
    // time requires
    require("time-require");
    // cache require paths for faster builds
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
var moment = require('moment');
var ignore      = require('metalsmith-ignore');
var getStats = require('./lib/get-stats').get;
var getSpecials = require('./lib/get-specials').get
var contentful = require('contentful-metalsmith');
var slug = require('slug'); slug.defaults.mode = 'rfc3986';
var filemetadata = require('metalsmith-filemetadata');
var copy = require('metalsmith-copy');
var replace = require('metalsmith-replace');
var beautify  = require('metalsmith-beautify');
var strip = require('strip');
var templates  = require('metalsmith-templates');
message('Loaded templating');
var lazysizes = require('metalsmith-lazysizes');
// metadata and structure
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
var parseHTML = require('./lib/parseHTML').parse;
var sass  = require('metalsmith-sass');
var concat = require('metalsmith-concat');
var autoprefixer = require('metalsmith-autoprefixer');
var browserify = require('browserify')
var icons = require('metalsmith-icons');
var feed = require('metalsmith-feed');
var headingsIdentifier = require('metalsmith-headings-identifier');
var headings = require('metalsmith-headings');
var sanitiseSwigTags = require('./lib/sanitiseSwigTags').sanitise
var htmlMinifier = require("metalsmith-html-minifier");
// only require in production
if(ENVIRONMENT==='production'){
    var uglify = require('metalsmith-uglify');
    var cleanCSS = require('metalsmith-clean-css');
    var uncss = require('metalsmith-uncss');
    var sitemap = require("metalsmith-sitemap");
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
// var prompt = require('prompt')
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
        '**/.DS_Store',
        'styles/partials/**'
    ]))
 
    // Set up some metadata
    .use(metadata({
        "siteInfo": "settings/site-info.json"
    }))
    .use(function (files,metalsmith,done){
        var meta = metalsmith.metadata();
        getStats(function(stats){
            meta.stats = stats;
            done();
        })
    })
    .use(function (files,metalsmith,done){
        var meta = metalsmith.metadata();
        getSpecials(function(specials){
            Object.keys(specials).forEach(function(specialType){
                meta[specialType] = specials[specialType];
            })
            done();
        })
    })
    .use(function (files,metalsmith,done){
        // hack to make metalsmith-feed plugin work by adding site.url to the metadata
        var meta = metalsmith.metadata();
        meta.site = {
            'url': meta.siteInfo.protocol + meta.siteInfo.domain,
            'description': meta.siteInfo.description
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
        each(Object.keys(files).filter(minimatch.filter('@(content-block|charity)/**/*.html')), function(file,cb){
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
                menus[meta.slug] = menu
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
                if(files[file].id === menu.sys.id && minimatch(file,'page/**')){
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
        people: {
            pattern: 'person/**/*.html',
            sortBy: 'menuOrder',
            metadata: {
                singular: 'person',
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
            sortBy: 'displayOrder',
            reverse: false,
            metadata: {
                singular: 'content-block',
            }
        },
        quotations: {
            pattern: 'quotation/**/*.html',
            sortBy: 'text',
            reverse: false,
            metadata: {
                singular: 'quotation',
            }
        },
        charities: {
            pattern: 'charity/**/*.html',
            sortBy: 'title',
            reverse: false,
            metadata: {
                singular: 'charity',
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
        // add paths to people and quotatons
        each(Object.keys(files).filter(minimatch.filter('@(person|quotation)/**/*.html')), apply, done )
        // recursively find parent links
        function apply(file, cb){
            var filePath = file.split('/')[0]
            files[file].breadcrumbs = [filePath, files[file].slug]
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
    .use(logMessage('Moved files into place'))
    .use(function (files, metalsmith, done) {
        var dynamicSiteRedirects = files['settings/_redirects'].contents.toString().split('\n').sort()
        // build a list of redirects from file meta
        var metadata =metalsmith.metadata();
        var redirects = {};
        var redirectsFile = [];
        Object.keys(files).forEach(function (file) {
            if(files[file].redirects){
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


        // call the parse function asynchronously
        each(Object.keys(files).filter(minimatch.filter('**/*.html')), parse, done )

        function parse (file,callback){
            files[file].contents = parseHTML(files[file].contents.toString(),files[file].collection,metalsmith.metadata().redirects)
            callback();
        }

    })
    // .use(function(){

    // })
    .use(logMessage('Converted Markdown to HTML'))
    .use(excerpts())
    .use(relative())
    .use(feed({
        title: 'The Giving What We Can Blog',
        collection: 'posts',
        destination: 'blog.xml',
        feed_url: 'https://www.givingwhatwecan.org/blog.xml',
        image_url: 'https://www.givingwhatwecan.org/images/favicons/apple-touch-icon-144x144.png',
        postDescription: function(file){
            var text = file.excerpt || file.contents;
            var authors = ""
            if(file.author){
                for (var i = 0; i < file.author.length; i++) {
                    authors += file.author[i].fields.title;
                    if(file.author.length>2 && i < file.author.length-1){
                        authors+=", "
                    }
                    if(file.author.length>1 && i === file.author.length-1){
                        authors+=" and "
                    }
                }
                authors+=" — "
            }
            return authors + text;
        }
    }))
    .use(logMessage('Generated RSS feed'))
    .use(branch(function(filename,props,i){

            return props.collection && (props.collection.indexOf('posts') > -1 || props.collection.indexOf('pages') > -1);
        })
        .use(headingsIdentifier({
            linkTemplate: "<a class='heading-permalink' href='#%s'><span></span></a>"
        }))
        .use(headings({
            selectors: ['h2,h3,h4']
        }))
        .use(logMessage('Created TOCs'))
    )
    .use(function (files, metalsmith, done) {
        // sanitise swig tags
        Object.keys(files).filter(minimatch.filter('**/*.html')).forEach(function(file){
            files[file].contents = sanitiseSwigTags(files[file].contents.toString());
        })
        done();
    })
    .use(templates({
        engine:'swig',
        requires: {swig:swig},
        moment: moment,
        pattern: "**/*.html",
        inPlace: true
    }))
    .use(logMessage('In place templating done'))
    .use(templates({
        engine:'swig',
        requires: {swig:swig},
        moment: moment,
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
        // we've incorporated content blocks & charities into other pages, but we don't need them as standalone pages in our final build.
        Object.keys(files).forEach(function(file){
            if(minimatch(file,'@(content-block|charity|quotation)/**')){
                delete files[file];
            }
        });
        done();
    })
    .use(lazysizes({
        widths: [100,480,768,992,1200,1800],
        qualities: [ 40, 40, 70, 70, 70, 70],
        backgrounds: ['#banner','.content-block-wrapper','.post-header'],
        ignore: "/images/**",
        ignoreSelectors:'.content-block-content',
        querystring: {
            w: '%%width%%',
            q: '%%quality%%'
        }
    }))
    .use(logMessage('Added responsive image markup'))
    // Build Javascript
    colophonemes
    .use(function (files,metalsmith,done){
        // Bundle our javascript files using browserify
        each(Object.keys(files).filter(minimatch.filter('scripts/*.bundle.js')),bundle,done)

        function bundle(file, cb){
            // the filename of our entry script, relative to the Metalsmith source directory
            var filePath = file;
            // the output filename of our bundle
            var outFilePath = file.replace('.bundle','');
            // the output filename of our sourcemap
            var mapFilePath = file.replace('bundle','map');
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
                delete files[file]
                 cb();
            })
        }
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
        .use(htmlMinifier({
            minifyJS: true
        }))
        .use(logMessage('Minified HTML'))
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
                    '.content-block-wrapper .scroll-down-chevron',
                    /slabtext/,
                    /lazyload/,
                    /tooltip/,
                    /sb/,
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
            filter: "scripts/includes/**"
        }))
        .use(logMessage('Minified Javascript'))
        .use(sitemap({
            hostname: 'https://www.givingwhatwecan.org',
            omitIndex: true,
            modified: 'data.sys.updatedAt',
            urlProperty: 'path'
        }))
        .use(logMessage('Built sitemap'))
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
                /*
                prompt.start()
                prompt.message = "Build again?"
                prompt.get(['response'],function(err,results){
                    if(err) {
                        if(err.message === 'canceled'){
                            console.log('Cancelled')
                            return;
                        } else {
                            throw new Error (err);
                        }
                    }
                    if(results.response.toLowerCase()==='n' || results.response.toLowerCase()==='n'){
                        console.log('Cancelled')
                        return;
                    }
                    build(buildCount+1);
                });*/
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