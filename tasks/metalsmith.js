// start a timer
var buildTime = process.hrtime()
var buildTimeDiff = buildTime
// load NODE_ENV variables
require('dotenv').load({silent: true})
// command-line args
var args = {}
process.argv.forEach(function (arg) {
  if (arg.indexOf('=') > -1) {
    arg = arg.split('=')
    args[arg[0]] = arg[1]
  } else if (arg.substr(0, 2) === '--') {
    args[arg] = true
  }
})
// NODE_ENV VARS - default to development
var {NODE_ENV, CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE} = process.env

if (NODE_ENV === 'development') {
    // time requires
    // require("time-require");
    // cache require paths for faster builds
  require('cache-require-paths')
}

// Start the build!
var chalk = require('chalk')
message('Generating the Giving What We Can site!', chalk.green, true)
message('Initialising new build...', chalk.dim, true)
// Metalsmith
var Metalsmith = require('metalsmith')
message('Loaded Metalsmith')
// templating
var metadata = require('metalsmith-metadata')
var moment = require('moment')
var ignore = require('metalsmith-ignore')
var getSpecials = require('../lib/get-specials').get
var contentful = require('contentful-metalsmith')
var slug = require('slug'); slug.defaults.mode = 'rfc3986'
// var filemetadata = require('metalsmith-filemetadata')
var assets = require('metalsmith-assets')
// var replace = require('metalsmith-replace')
// var strip = require('strip')
var templates = require('metalsmith-templates')
message('Loaded templating')
var lazysizes = require('metalsmith-lazysizes')
// metadata and structure
var branch = require('metalsmith-branch')
var collections = require('metalsmith-collections')
// var permalinks = require('metalsmith-permalinks')
var relative = require('metalsmith-relative')
// var navigation = require('metalsmith-navigation')
var excerpts = require('metalsmith-excerpts')
var pagination = require('metalsmith-pagination')
message('Loaded metadata')
// static file compilation
var swig = require('swig')
require('../lib/swig-filters')(swig)
var parseHTML = require('../lib/parseHTML').parse
var concat = require('metalsmith-concat')
var icons = require('metalsmith-icons')
var feed = require('metalsmith-feed')
var headingsIdentifier = require('metalsmith-headings-identifier')
var headings = require('metalsmith-headings')
var sanitiseSwigTags = require('../lib/sanitiseSwigTags').sanitise
// only require in production
if (NODE_ENV === 'production') {
  var htmlMinifier = require('metalsmith-html-minifier')
  var autoprefixer = require('metalsmith-autoprefixer')
  var cleanCSS = require('metalsmith-clean-css')
  var purifyCSS = require('purifycss')
  // var uncss = require('metalsmith-uncss')
  var sitemap = require('metalsmith-sitemap')
    // var subset = require('metalsmith-subsetfonts')
}
message('Loaded static file compilation')
// utility
// var fs = require('fs')
var path = require('path')
// var extend = require('util')._extend
var each = require('async').each
var merge = require('merge')
var minimatch = require('minimatch')
var NotificationCenter = require('node-notifier').NotificationCenter
var notifier = new NotificationCenter()
// var prompt = require('prompt')
// var YAML = require('yamljs')
message('Loaded utilities...')
// var debug = require('debug')('build');
message('All dependencies loaded!', chalk.cyan)

// call the master build function
build(1)

//
function build (buildCount) {
  buildCount = buildCount || 1
  if (buildCount > 1) {
    buildTime = process.hrtime()
    buildTimeDiff = buildTime
  }

    // hacky solution to share data between Contentful pages and the 'pagination' plugin
  var collectionSlugs = ['blog', 'causes', 'charities', 'reports']
  var collectionInfo = {
    blog: {
      title: 'Blog',
      singular: 'post',
      sortBy: 'date',
      reverse: true,
      perPage: 10
    },
    causes: {
      title: 'Causes',
      singular: 'cause',
      sortBy: 'priority'
    },
    charities: {
      title: 'Charities',
      singular: 'charity',
      sortBy: 'recommendationLevel'
    },
    reports: {
      title: 'Reports',
      singular: 'report',
      sortBy: 'date',
      reverse: true
    }
  }
  var collectionData = {}
  var collectionOptions = {}
  var paginationOptions = {}
  collectionSlugs.forEach(function (slug) {
    collectionData[slug] = {}
    collectionOptions[slug] = {

      pattern: collectionInfo[slug].singular + '/**/*.html',
      sortBy: collectionInfo[slug].sortBy || 'title',
      reverse: collectionInfo[slug].reverse || false,
      metadata: {
        singular: collectionInfo[slug].singular
      }

    }
    paginationOptions['collections.' + slug] = {
      perPage: collectionInfo[slug].perPage || 100,
      template: './partials/collection-' + slug + '.swig',
      first: slug + '/index.html',
      path: slug + '/page/:num/index.html',
      pageMetadata: collectionData[slug]
    }
  })

    // START THE BUILD!
  var colophonemes = new Metalsmith(__dirname)
  colophonemes
    .use(logMessage('NODE_ENV: ' + NODE_ENV, chalk.dim, true))
    .use(logMessage('NODE VERSION: ' + process.version, chalk.dim, true))
    .use(logMessage('BUILD TIME: ' + moment().format('YYYY-MM-DD @ H:m'), chalk.dim, true))
    .source('../src/metalsmith')
    .destination('../dest')
    .use(ignore([
      '**/.DS_Store',
      'styles/partials/**'
    ]))

    // Set up some metadata
    .use(metadata({
      'siteInfo': 'settings/site-info.json',
      'fundraisingAmounts': 'settings/fundraising.json',
      'stats': 'settings/stats.json'
    }))
    .use(function (files, metalsmith, done) {
      var meta = metalsmith.metadata()
      getSpecials(function (specials) {
        Object.keys(specials).forEach(function (specialType) {
          meta[specialType] = specials[specialType]
        })
        done()
      })
    })
    .use(function (files, metalsmith, done) {
        // hack to make metalsmith-feed plugin work by adding site.url to the metadata
      var meta = metalsmith.metadata()
      meta.site = {
        'title': meta.siteInfo.title,
        'url': meta.siteInfo.protocol + meta.siteInfo.domain,
        'description': meta.siteInfo.description
      }
      done()
    })
    .use(function (files, metalsmith, done) {
      // hack to add stats for AMF
      var meta = metalsmith.metadata()
      meta.stats.amfCostPerLifeSaved = 2838
      meta.stats.numberMembers = meta.stats.TotalGWWCMembers
      // hardcode numbers from database
      // parfit=> SELECT sum(amount_normalized)::MONEY from pledges.reported_donation;
      meta.stats.amountDonated = 126751939 // meta.stats.TotalPayments
      // just copied from the front page
      meta.stats.amountPledged = 1572586402 // meta.stats.TotalLiability
      done()
    })
    .use(function (files, metalsmith, done) {
        // add defaults to all our contentful source files
      var options = {
        space_id: CONTENTFUL_SPACE,
        limit: 1000,
        permalink_style: true
      }
      each(Object.keys(files), apply, done)

      function apply (file, cb) {
        var meta = files[file]
        if (!meta.contentful) { cb(); return }
        meta.contentful = merge(true, options, meta.contentful)

        // TODO;
        // // limit to 10 blog posts in development for faster builds
        // if (NODE_ENV === 'development' && meta.contentful.content_type === '5TB8GVLD7UUMkEYSEuUGsM') {
        //   meta.contentful.limit = 10
        // }

        cb()
      }
    })
    .use(logMessage('Prepared global metadata'))
    .use(contentful({ 'access_token': CONTENTFUL_ACCESS_TOKEN }))
    .use(function (files, metalsmith, done) {
        // get rid of the contentful source files from the build
      each(Object.keys(files), function (file, cb) {
        if (minimatch(file, 'contentful/**')) {
          delete files[file]
        }
        cb()
      }, done)
    })
    .use(logMessage('Downloaded content from Contentful'))
    .use(function (files, metalsmith, done) {
        // fix weird situation where contentful adds a double slash to the index page if the slug is set as '/'
      if (files['page//index.html']) {
        files['page/index.html'] = files['page//index.html']
        delete files['page//index.html']
      }
      done()
    })
    .use(function (files, metalsmith, done) {
        // move the contentful 'fields' metadata to the file's global meta
      each(Object.keys(files).filter(minimatch.filter('**/*.html')), function (file, callback) {
        var meta = files[file]
        if (!meta.data || !meta.data.fields) { callback(); return }
        each(Object.keys(meta.data.fields), function (key, cb) {
          if (['body', 'bio'].indexOf(key) === -1) {
            meta[key] = meta.data.fields[key]
          } else {
            meta['contents'] = meta.data.fields[key]
          }
          cb()
        }, function () {
                // add date information to the post
          meta.date = meta.date || meta.data.sys.createdAt
          meta.updated = meta.updated || meta.data.sys.updatedAt
                // concat footnotes into main content field
          if (meta.body2 || meta.footnotes) {
            meta.contents = [meta.contents, meta.body2, meta.footnotes]
              .filter(a => a)
              .map(a => a.trim())
              .join('\n\n')
            if (meta.footnotes) delete meta.footnotes
            if (meta.body2) delete meta.body2
          }
                // TODO caveats
          if (meta.recommendationLevel) {
            meta.recommendationLevel = parseInt(meta.recommendationLevel.split(' ')[0])
          }
          if (meta.priority) {
            meta.priority = parseInt(meta.priority.split(' ')[0])
          }
          callback()
        })
      }, done)
    })
    .use(function (files, metalsmith, done) {
        // remove templates from content blocks
      each(Object.keys(files).filter(minimatch.filter('@(content-block)/**/*.html')), function (file, cb) {
        var meta = files[file]
        if (meta.template) delete meta.template
        cb()
      }, done)
    })
    .use(function (files, metalsmith, done) {
        // add any menus to the global metadata, and get rid of the source files
      var menus = {}
      each(Object.keys(files).filter(minimatch.filter('@(menu)/**/*.html')), apply, function () {
        var metadata = metalsmith.metadata()
        metadata.menus = menus
        done()
      })

      function apply (file, cb) {
        var meta = files[file]
        if (meta.topLevelMenu) {
          var menu = traverse(meta.data, [], 1)[0]._children
          menus[meta.slug] = menu
        }
        delete files[file]
        cb()
      }
      function traverse (menu, a, depth) {
        if (!menu.fields || depth > 3) {
          return
        }
        if (menu.fields.children) {
          depth++
          var c = []
          menu.fields.children.forEach(function (child) {
            var page = getFile(child)
            if (page) {
              c.push({_page: page})
            } else if (child.fields && child.fields.linkURL) {
              c.push({_link: child.fields})
            }
            traverse(child, c, depth)
          })
          a.push({_menu: menu, _children: c})
        }
        return a
      }
      function getFile (menu) {
        var found = false
        Object.keys(files).forEach(function (file) {
          if (files[file].id === menu.sys.id && minimatch(file, 'page/**')) {
            found = file
          }
        })
        return found ? files[found] : false
      }
    })
    .use(logMessage('Processed Contentful metadata'))
    .use(collections(collectionOptions))
    .use(function (files, metalsmith, done) {
        // get metadata from the contentful pages that correspond to our collections,
        // save them to a global variable that we can use in the 'pagination' plug-in
        // and get rid of the original page
      var fields = ['title', 'shortTitle', 'slug', 'contents', 'featuredImage', 'ogImage', 'redirects', 'excerpt']
      collectionSlugs.forEach(function (slug) {
        var file = 'page/' + slug + '/index.html'
        var page = files[file]
        if (page) {
          fields.forEach(function (field) {
            if (page[field]) {
              collectionData[slug][(field === 'contents' ? '_contents' : field)] = page[field]
            }
          })
          delete files[file]
        }
      })
      done()
    })
    .use(pagination(paginationOptions))
    .use(function (files, metalsmith, done) {
        // add the 'contents' back to each file generated by the 'pagination' plug-in
      Object.keys(files).filter(minimatch.filter('@(' + collectionSlugs.join('|') + ')/**')).forEach(function (file) {
        files[file].contents = new Buffer((files[file]._contents ? files[file]._contents : ''))
        delete files[file]._contents
      })
      done()
    })
    .use(function (files, metalsmith, done) {
      // get rid of the existing collections in the global metadata so that we
      // can create clean collections when we index the rest of the content
      var metadata = metalsmith.metadata();
      ['collections', 'posts', 'causes', 'charities', 'reports'].forEach(function (m) {
        delete metadata[m]
      })
      each(Object.keys(files), apply, done)
      function apply (file, cb) {
        delete files[file].collection
        cb()
      }
    })
    .use(logMessage('Prepared blog posts'))
    .use(collections({
        // just add the posts to the collection, so that we can add the blog archive pages to the 'pages' collection after the 'paginate' plugin runs
      _pages: {
        pattern: 'page/**/*.html',
        sortBy: 'menuOrder',
        metadata: {
          singular: 'page'
        }
      },
      _blogs: {
        pattern: 'blog/**/*.html',
        sortBy: 'menuOrder',
        metadata: {
          singular: 'blog'
        }
      },
      _people: {
        pattern: 'person/**/*.html',
        sortBy: 'menuOrder',
        metadata: {
          singular: 'person'
        }
      },
      _posts: {
        pattern: 'post/**/*.html',
        sortBy: 'date',
        reverse: true,
        metadata: {
          singular: 'post'
        }
      },
      _contentBlocks: {
        pattern: 'content-block/**/*.html',
        sortBy: 'displayOrder',
        reverse: false,
        metadata: {
          singular: 'content-block'
        }
      },
      _quotations: {
        pattern: 'quotation/**/*.html',
        sortBy: 'text',
        reverse: false,
        metadata: {
          singular: 'quotation'
        }
      },
      _charities: {
        pattern: 'charity/**/*.html',
        sortBy: 'title',
        reverse: false,
        metadata: {
          singular: 'charity'
        }
      },
      _causes: {
        pattern: 'cause/**/*.html',
        sortBy: 'title',
        reverse: false,
        metadata: {
          singular: 'cause'
        }
      },
      _reports: {
        pattern: 'report/**/*.html',
        sortBy: 'title',
        reverse: false,
        metadata: {
          singular: 'report'
        }
      }
    }))
    .use(logMessage('Added files to collections'))
    .use(function (files, metalsmith, done) {
        // check all of our HTML files have slugs
      each(Object.keys(files).filter(minimatch.filter('@(page)/**/*.html')), apply, done)

      function apply (file, cb) {
        meta = files[file]
            // add a slug
        if (!meta.slug) {
          if (meta.title) {
            meta.slug = slug(meta.title)
          } else if (meta.name) {
            meta.slug = slug(meta.name)
          } else {
            throw new Error('Could not set slug for file ' + file)
          }
        }
        cb()
      }
    })

    .use(function (files, metalsmith, done) {
        // add parents to pages if needed
      each(Object.keys(files).filter(minimatch.filter('@(page)/**/*.html')), apply, done)
        // recursively find parent links
      function apply (file, cb) {
        files[file].breadcrumbs = files[file].parent ? getParent(files[file].parent, [files[file].slug]) : [files[file].slug]
        files[file].path = files[file].slug !== '/' ? files[file].breadcrumbs.join('/') : '.'
        cb()
      }
      function getParent (parent, path) {
        path = path || []
        if (!parent.fields) throw new Error('Parent of ' + path + 'has no fields!' + parent.sys.id)
        if (!parent.fields.slug) throw new Error('Parent has no slug!' + parent.sys.id)
        path.unshift(parent.fields.slug)
        if (parent.fields.parent) {
          return getParent(parent.fields.parent, path)
        } else {
          return path
        }
      }
    })
    .use(function (files, metalsmith, done) {
        // add paths to all files
      each(Object.keys(files).filter(minimatch.filter('@(quotation|person|cause|report|charity)/**/*.html')), apply, done)
        // recursively find parent links
      function apply (file, cb) {
        var filePath = file.split('/')[0]
        files[file].breadcrumbs = [filePath, files[file].slug]
        files[file].path = files[file].breadcrumbs.join('/')
        cb()
      }
    })

    .use(function (files, metalsmith, done) {
        // set a nice path for blog posts
      each(Object.keys(files).filter(minimatch.filter('@(post)/**/*.html')), apply, done)
      function apply (file, cb) {
        var date = moment(files[file].date, moment.ISO_8601).format('YYYY/MM')
        var filepath = 'post/' + date + '/' + files[file].slug
            // add the path to the files metadata
        files[file].path = filepath
        cb()
      }
    })
    .use(logMessage('Added navigation metadata'))
    .use(function (files, metalsmith, done) {
        // move files so that their location matches their path
        // or add a path if they don't have one
      each(Object.keys(files).filter(minimatch.filter('**/*.html')), apply, done)
      function apply (file, cb) {
        var filepath = files[file].path
        if (filepath) {
          if (typeof filepath !== 'string') {
            throw new Error('File path should be a string ' + file)
          }
                // normalize paths by getting rid of index.html
          var index = /\/index\.html$/
          if (index.test(filepath)) {
            filepath = filepath.replace(index, '')
            files[file].path = filepath
          }
          if (filepath + '/index.html' !== file) {
            files[path.join(filepath !== '.' ? filepath : '', 'index.html')] = files[file]
            delete files[file]
          }
        }
        cb()
      }
    })
    .use(logMessage('Moved files into place'))
    .use(function (files, metalsmith, done) {
      var dynamicSiteRedirects = files['settings/_redirects'].contents.toString().split('\n')
        // build a list of redirects from file meta
      var metadata = metalsmith.metadata()
      var redirects = {}
      var redirectsFile = []
      Object.keys(files).forEach(function (file) {
        if (files[file].redirects) {
          files[file].redirects.forEach(function (redirect) {
            if (redirect !== '/' + files[file].path) {
              redirects[redirect] = files[file]
              redirectsFile.push(redirect + ' /' + files[file].path + ' 301')
            }
          })
        }
      })

        // inject the list of redirects into the global metadata
      metadata.redirects = redirects

        // create a _redirects file for Netlify
      redirectsFile.sort()
      redirectsFile = redirectsFile.concat(dynamicSiteRedirects)
      files['_redirects'] = {contents: redirectsFile.join('\n')}
      done()
    })
    .use(logMessage('Calculated redirects'))
    // Build HTML files
    .use(function (files, metalsmith, done) {
        // call the parse function asynchronously
      each(Object.keys(files).filter(minimatch.filter('**/*.html')), parse, done)

      function parse (file, callback) {
        files[file].contents = parseHTML(files[file].contents.toString(), files[file], metalsmith.metadata().redirects)
        callback()
      }
    })
    // .use(function(){

    // })
    .use(logMessage('Converted Markdown to HTML'))
    .use(excerpts())
    .use(relative())
    .use(feed({
      title: 'The Giving What We Can Blog',
      collection: '_posts',
      destination: 'blog.xml',
      feed_url: 'https://www.givingwhatwecan.org/blog.xml',
      image_url: 'https://www.givingwhatwecan.org/images/favicons/apple-touch-icon-144x144.png',
      postDescription: function (file) {
        var text = file.excerpt || file.contents
        var authors = ''
        if (file.author) {
          for (var i = 0; i < file.author.length; i++) {
            authors += file.author[i].fields.title
            // TODO; what does this do without a person
            if (file.author.length > 2 && i < file.author.length - 1) {
              authors += ', '
            }
            if (file.author.length > 1 && i === file.author.length - 1) {
              authors += ' and '
            }
          }
          authors += ' — '
        }
        return authors + text
      }
    }))
    .use(logMessage('Generated RSS feed'))
    .use(branch(function (filename, props, i) {
      return props.collection && (
                props.collection.indexOf('_posts') > -1 ||
                props.collection.indexOf('_causes') > -1 ||
                props.collection.indexOf('_reports') > -1 ||
                props.collection.indexOf('_charities') > -1 ||
                props.collection.indexOf('_pages') > -1
            )
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
      Object.keys(files).filter(minimatch.filter('**/*.html')).forEach(function (file) {
        files[file].contents = sanitiseSwigTags(files[file].contents.toString())
      })
      done()
    })
    .use(function (files, metalsmith, done) {
        // make sure that everything has a template key (new version of contentful-metalsmith)
      Object.keys(files).forEach(file => {
        var meta = files[file]
        if (!meta.template && meta.layout && !minimatch(file, '@(content-block|quotation)/**')) {
          meta.template = meta.layout
        }
      })
      done()
    })
    .use(templates({
      engine: 'swig',
      directory: '../src/templates',
      requires: {swig: swig},
      moment: moment,
      pattern: '**/*.html',
      inPlace: true
    }))
    .use(logMessage('Completed in-place templating'))
    .use(function (files, metalsmith, done) {
        // create matching JSON files for each piece of content
      each(Object.keys(files).filter(minimatch.filter('**/index.html')), create, function (err) {
        if (err) throw err
        done()
      })

      function create (file, cb) {
        var jsonfile = file.replace('/index.html', '.json')
        if (jsonfile === file) {
          cb()
          return
        }

        var json = {}
        var fields = [
          'contents',
          'id',
          'contentType',
          'title',
          'slug',
          'path',
          'excerpt',
          'headings',
          'date',
          'updated'
        ]
        fields.forEach(function (field) {
          if (files[file][field]) {
            json[field] = files[file][field]
          }
        })
        json.contents = json.contents.toString()
        files[jsonfile] = {contents: JSON.stringify(json)}
        cb()
      }
    })
    .use(function () {
      console.log('yeah boi')
    })
    .use(templates({
      engine: 'swig',
      directory: '../src/templates',
      requires: {swig: swig},
      moment: moment,
      collectionSlugs: collectionSlugs,
      collectionInfo: collectionInfo
    }))
    .use(logMessage('Built HTML files from templates'))
    .use(icons({
      sets: { fa: 'fontawesome'},
      fontDir: 'fonts',
      customIcons: 'fonts/glyphs.json'
    }))
    .use(logMessage('Added icon fonts'))
    .use(function (files, metalsmith, done) {
      // certain content has been incorporated into other pages, but we don't
      // need them as standalone pages in our final build.
      Object.keys(files).forEach(function (file) {
        if (minimatch(file, '@(content-block|quotation)/**')) {
          delete files[file]
        }
      })
      done()
    })
    .use(lazysizes({
      widths: [100, 480, 768, 992, 1200, 1800],
      qualities: [ 40, 40, 70, 70, 70, 70],
      backgrounds: ['#banner', '.content-block-wrapper', '.post-header', '.featured-image'],
      ignore: '/images/**',
      ignoreSelectors: '.content-block-content',
      querystring: {
        w: '%%width%%',
        q: '%%quality%%'
      }
    }))
    .use(logMessage('Added responsive image markup'))
    // Concat CSS
  colophonemes
    .use(concat({
      files: ['styles/app.min.css', 'styles/icons.css'],
      output: 'styles/app.concat.min.css',
      keepConcatenated: true
    }))
    .use(function (files, metalsmith, done) {
        // hacky fix to put styles back in the right place after concat
      files['styles/app.min.css'] = {contents: files['styles/app.concat.min.css'].contents}
      delete files['styles/app.concat.min.css']
      done()
    })
    .use(logMessage('Concatenated CSS files'))
    .use(assets({
      source: '../src/public'
    }))
    .use(logMessage('Moved static files into place'))

    // stuff to only do in production
  if (NODE_ENV === 'production') {
    colophonemes
        .use(logMessage('Cleaning CSS files', chalk.dim))
        .use(function purifyCSSPlugin (files, metalsmith, done) {
          var cssFile = 'styles/app.min.css'
          var whitelist = [
            '*collaps*',
            '*nav*',
            '*dropdown*',
            '*modal*',
            '*fade*',
            '*in*',
            '*open*',
            '*ct-*',
            '*slider*',
            'loader',
            'transparent',
            '*scroll-down-chevron*',
            '*slabtext*',
            '*lazyload*',
            '*tooltip*',
            '*alert*',
            '*sb-*',
            '*highlighted*',
            '*report-contents*'
          ]
          var html = []
          var re = /$[\s\S]*?<body.*?>([\s\S]+)<\/body>[\s\S]*?^/im
          Object.keys(files).filter(minimatch.filter('**/*.html')).forEach(function (file) {
            var match = files[file].contents.toString().match(re)
            if (match && match.length >= 2 && typeof match[1] === 'string' && match[1].length > 0) {
              html.push(match[1])
            }
          })
          html = html.join('\n')
          var purifiedCSS = purifyCSS(html, files[cssFile].contents.toString(), {
            whitelist: whitelist
          })
          files[cssFile].contents = new Buffer(purifiedCSS)
          done()
        })
        .use(autoprefixer())
        .use(cleanCSS)
        .use(logMessage('Minifying HTML', chalk.dim))
        .use(htmlMinifier({
          minifyJS: true
        }))
        .use(logMessage('Minified HTML'))
        .use(sitemap({
          hostname: 'https://www.givingwhatwecan.org',
          omitIndex: true,
          modified: 'data.sys.updatedAt',
          urlProperty: 'path'
        }))
        .use(logMessage('Built sitemap'))
  }

    // Run build
  colophonemes.use(logMessage('Finalising build')).build(function (err, files) {
    var t = formatBuildTime(buildTime)
    if (err) {
      console.log('Build Failed!', '(Build time: ' + t + ')')
      console.log('Errors:')
      console.trace(err)
      if (NODE_ENV === 'development') {
        notifier.notify({
          title: 'Build failed!',
          message: err,
          appIcon: '',
          contentImage: path.join(__dirname, 'src', 'images', 'favicons', 'favicon-96x96.png'), // absolute path (not balloons)
          sound: 'Funk',
          activate: 'com.apple.Terminal'
        })
      }
    }
    if (files) {
      console.log('Build OK!', '(Build time: ' + t + ')')
      if (NODE_ENV === 'development') {
        notifier.notify({
          title: 'Website built!',
          message: 'Build time: ' + t + '\nClick to switch to Chrome',
          appIcon: '',
          contentImage: path.join(__dirname, 'src', 'images', 'favicons', 'favicon-96x96.png'), // absolute path (not balloons)
          sound: 'Glass',
          activate: 'com.google.Chrome'
        })
      }
    }
  })
}

// UTILITIES //

// SEND CONSOLE MESSAGES
function message (m, c, t) {
  c = c || chalk.yellow.bold
  t = t || false
  var output = c(m)
  if (!t) {
    output += '................................................'.substr(m.length)
    output += chalk.dim('(+' + formatBuildTimeDiff() + ' / ' + formatBuildTime() + ')')
  }
  console.log('-', output)
}
function logMessage (m, c, t) {
  c = c || chalk.bold.blue
  return function (files, metalsmith, done) {
    message(m, c, t)
    done()
  }
}
// FORMAT BUILD TIMER INTO Mins : secs . milliseconds
function formatBuildTime (hrTimeObj) {
  hrTimeObj = hrTimeObj || buildTime
  var t = process.hrtime(hrTimeObj)
  return (t[0] + (t[1] / 10e+9)).toFixed(3) + 's'
}
function formatBuildTimeDiff () {
  var t = buildTimeDiff
  buildTimeDiff = process.hrtime()
  return formatBuildTime(t)
}
