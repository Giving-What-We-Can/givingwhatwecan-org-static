var MarkdownIt = require('markdown-it')
var MarkdownItFootnote = require('markdown-it-footnote');
// var MarkdownItRegExp = require('markdown-it-regexp')
// var MarkdownItAttrs = require('markdown-it-attrs')
// var MarkdownItSub = require('markdown-it-sub');
// var MarkdownItSup = require('markdown-it-sup');
var cheerio = require('cheerio');
var typogr = require('typogr');

exports.parse = function(html,meta,redirects) {

    // collection = typeof collection === 'string' ? [collection] : collection || [];
    var md = new MarkdownIt({
        html:true
    })
    .use(MarkdownItFootnote)
    // .use(MarkdownItAttrs)
    // .use(MarkdownItRegExp(
    //     /(\{%|\{\{)(.*?)(\}\}|%\})/,
    //     function(match){
    //         return match[0]
    //     }
    // ))
    ;

    var html = md.render( html );
    // get rid of html entities, as they break in-place templating logic later
    // use Cheerio to modify HTML
    $ = cheerio.load(html);
    
    $('p').first().addClass('first-paragraph')
    // use our global list of redirects to resolve any outdated internal links in the body (only bother in production)
    if(redirects){
        $('a').each(function(){
            var a = $(this);
            var href = a.attr('href');
            if(href && href.length > 0){
                // remove giving what we can domain
                var gwwc = /^(http|https):\/\/givingwhatwecan.org(\/.+)/
                if(gwwc.test(href)) href = href.match(gwwc)[2]
                // if we have a match for this link in our redirects list, and it's different to the existing link, update it
                if(Object.keys(redirects).indexOf(href) > -1 && '/'+redirects[href].path !== href){
                    a.attr('href','/'+redirects[href].path);
                }
                // if the filetype is PDF, add an icon
                if(href.substr(href.length-4).toLowerCase()==='.pdf'){
                    a.append(' <i class="fa fa-file-pdf-o"></i>')
                }
            }
        });
    }

    $('img').each(function(){
        var img = $(this);
        // wrap images that are in p tags in figures instead
        var parent = img.parent();
        if(parent[0] && parent[0].name === 'p'){
            parent.replaceWith(function(){
                return $('<div class="row" />').append($('<figure class="col-xs-12" />').append($(this).contents()));
            })
        }
        // add img-responsive tags to images
        img.addClass('img-responsive');
    })

    $('table').each(function(){
        var table = $(this);
        // add bootstrap styles to tables
        table.replaceWith(function(){
            return $('<div class="container" />').append($('<table class="table table-striped" />').append($(this).contents()))
        })
    })
    if(meta.collection.indexOf('_reports')>-1 || meta.slug === "frequently-asked-questions"){
        var headingIndex = [0,0,0,0,0,0,0];
        $('h2,h3,h4,h5,h6').each(function(){
            var heading = $(this);
            var tag = heading[0].name;
            var level = parseInt(tag.charAt(1))
            // add legal-style numbers to each heading
            headingIndex[level+1] = 0;
            headingIndex[level]++;
            var index = headingIndex.slice(2,level+1)
            heading.prepend("<span class='index'>"+index.join('.')+". </span>")
        })
    }

    html = $.html();
    // typogr
    html = typogr.typogrify(html)

    // save back to the main metalsmith array
    return html;

} 