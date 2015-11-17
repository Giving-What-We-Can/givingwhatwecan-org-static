require('dotenv').load()


var express = require('express')
var app = express()
var swig = require('swig')
    require('./lib/swig-filters')(swig)
var engines = require('consolidate')
var contentful = require('contentful');
var parseHTML = require('./lib/parseHTML')
var sanitiseSwigTags = require('./lib/sanitiseSwigTags')
var getSpecials = require('./lib/get-specials')

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
app.set('views', __dirname + '/templates');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!


app.use('/scripts',express.static('dest/scripts'));
app.use('/styles',express.static('dest/styles'));
app.use('/images',express.static('dest/images'));
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
    var contentType = req.params.contentType
    var contentID = req.params.contentID
    var contentTypeName, templateName

    client.contentTypes()
    .then(function(contentTypes){
        for (var i = contentTypes.length - 1; i >= 0; i--) {
            if(contentTypes[i].sys.id === contentType){
                contentTypeName = contentTypes[i].name
                break
            }
        };
        if(contentTypeName){
            contentTypeSingular = contentTypeName.toLowerCase()
            contentTypeSlug = contentTypeSingular + 's'
            client.entries({
                'sys.id':contentID,
                include: 2
            })
            .then(function(entry){
                var entryData = entry[0].fields
                entryData.fieldNames = Object.keys(entry[0].fields)
                getSpecials(function(specials){
                    engines.swig.render(
                        sanitiseSwigTags(
                            parseHTML(entryData.contents,contentTypeSlug)
                        ),
                        {
                            specials:specials,
                            server: true
                        }
                    ).then(function(rendered){
                        entryData.collection = contentTypeSlug
                        entryData.collections = {}
                        entryData.collections[contentTypeSlug] = {metadata:{singular:contentTypeSingular}}
                        var templateName = entryData.template || contentTypeSingular
                        entryData.contents = rendered
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