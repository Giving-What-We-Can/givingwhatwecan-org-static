require('dotenv').load()


var express = require('express')
var app = express()
var swig = require('swig')
    require('../lib/swig-filters')(swig)
var engines = require('consolidate')
var fs = require('fs')
var path = require('path')
var contentful = require('contentful');
var parseHTML = require('../lib/parseHTML').parse
var getSpecials = require('../lib/get-specials').get
var sanitiseSwigTags = require('../lib/sanitiseSwigTags').sanitise

var https = require("https");


var client = contentful.createClient({
  // ID of Space 
  space: process.env.CONTENTFUL_SPACE,
 
  // A valid access token within the Space 
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
 
  // Enable or disable SSL. Enabled by default. 
  secure: true,
 
  // Set an alternate hostname, default shown. 
  host: 'preview.contentful.com',
 
  // Resolve links to entries and assets 
  resolveLinks: true
});

// This is where all the magic happens!
app.engine('swig', engines.swig);

app.set('view engine', 'swig');
app.set('views', __dirname + '/../src/templates');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

var srcdir = path.normalize(__dirname+'/../src/metalsmith');

app.use('/scripts',express.static(path.join(srcdir,'scripts')));
app.use('/fonts',express.static(path.join(srcdir,'fonts')));
app.use('/styles',express.static(path.join(srcdir,'styles')));
app.use('/images',express.static(path.join(srcdir,'images')));
app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {

    client.contentTypes()
    .then(function(contentTypes){
        res.render('server/stagingHome',{
            title: "Giving What We Can Staging",
            contentTypes: contentTypes
        });
    })
});

app.get('/rebuild', function (req, res) {

    var url = require("url").parse(process.env.NETLIFY_WEBHOOK);
    console.log(url)
    var options = {
        hostname: url.hostname,
        port: 443,
        path: url.path,
        method: 'POST'
    };

    var request = https.request(options, function(response) {
        response.on('end',function(){
            res.render('server/rebuild',{
                response: response
            });
        })

    });
    request.on('error', function(e) {
      console.error(e);
    });
    request.write('');
    request.end();
});

app.get('/:contentType', function (req, res) {
    var contentType = req.params.contentType
    var contentTypeName

    client.contentTypes()
    .then(function(contentTypes){
        for (var i = contentTypes.length - 1; i >= 0; i--) {
            if(contentTypes[i].sys.id === contentType){
                contentTypeName = contentTypes[i].name
                break
            }
        };
        if(contentTypeName){
            client.entries({
                content_type: contentType,
                order: '-sys.updatedAt'
            })
            .then(function(entries){
                res.render('server/listEntries',{
                    contentType: contentType,
                    contentTypeName: contentTypeName,
                    entries: entries
                });
            })
        } else {
            res.send('No content type matches ' + contentType)
        }
    })
});

app.get('/:contentType/:contentID', function (req, res) {
    console.log('Starting...')
    var contentType = req.params.contentType
    var contentID = req.params.contentID
    var contentTypeName, templateName

    client.contentTypes()
    .then(function(contentTypes){
        console.log('Got content types...')
        for (var i = contentTypes.length - 1; i >= 0; i--) {
            if(contentTypes[i].sys.id === contentType){
                contentTypeName = contentTypes[i].name
                break
            }
        };
        if(contentTypeName){
            console.log('Got entry type '+contentTypeName+'...')
            contentTypeSingular = contentTypeName.toLowerCase()
            contentTypeSlug = contentTypeSingular + 's'
            client.entries({
                'sys.id':contentID,
                include: 2
            })
            .then(function(entry){
                console.log('Got entry...')
                var entryData = entry[0].fields
                var inPlaceData = {
                    server: true,
                    cache: false
                }
                entryData.fieldNames = Object.keys(entry[0].fields)
                inPlaceData.stats = JSON.stringify(fs.readFileSync(path.join(__dirname,'..','src','metalsmith','settings','stats.json')))
                getSpecials(function(specials){
                    console.log('Got specials...')
                    Object.keys(specials).forEach(function(special){
                        inPlaceData[special] = specials[special]
                    })
                    if(entryData.footnotes){
                        entryData.contents = entryData.contents + '\n\n' + entryData.footnotes;
                        delete entryData.footnotes;
                    }
                    // add 'collections' metadata
                    var collections = {
                        'Page':'_pages',
                        'Post':'_posts',
                        'Charity':'_charities',
                        'Causes':'_causes',
                        'Report':'_reports',
                    }
                    entryData.collection = [collections[contentTypeName]];
                    entryData.collections = {
                        '_pages':{
                            metadata: {
                                singular: 'page'
                            }
                        },
                        '_posts':{
                            metadata: {
                                singular: 'post'
                            }
                        },
                        '_charities':{
                            metadata: {
                                singular: 'charity'
                            }
                        },
                        '_causes':{
                            metadata: {
                                singular: 'cause'
                            }
                        },
                        '_reports':{
                            metadata: {
                                singular: 'report'
                            }
                        },
                    };
                    // do in-place template rendering
                    engines.swig.render(
                        sanitiseSwigTags(
                            parseHTML(entryData.contents,entryData)
                        ),
                        inPlaceData
                    ).then(function(rendered){
                        console.log('Rendered in-place templates...')
                        // add 'collections' metadata
                        entryData.collections[contentTypeSlug] = {metadata:{singular:contentTypeSingular}}
                        var templateName = entryData.template || contentTypeSingular
                        entryData.contents = rendered
                        console.log('Rendering templates...')
                        res.render(templateName,entryData);
                    })
                    .error(function(err){
                        console.log(err)
                    })
                })
            })
        } else {
            res.send('No content type matches ' + contentType)
        }
    })
});


app.listen(app.get('port'), function() {
  console.log('Staging server is running on port', app.get('port'));
});