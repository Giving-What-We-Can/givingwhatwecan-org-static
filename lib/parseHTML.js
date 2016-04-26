var MarkdownIt = require('markdown-it')
var MarkdownItFootnote = require('markdown-it-footnote');
// var MarkdownItRegExp = require('markdown-it-regexp')
// var MarkdownItAttrs = require('markdown-it-attrs')
// var MarkdownItSub = require('markdown-it-sub');
// var MarkdownItSup = require('markdown-it-sup');
var cheerio = require('cheerio');
var typogr = require('typogr');

exports.parse = function(html,meta,redirects) {
    if(!html || html.toString().length === '') return '';
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
    // styling for first paragraphs on blog posts/pages
    if(meta && meta.collection && 
        (meta.collection.indexOf('_people')===-1)
    ){
        $('p').first().addClass('first-paragraph')
    }
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
                var figcaption = $('<figcaption />')
                    .append( $(this).contents().clone() )
                figcaption.find('img').remove()
                if(figcaption.text().length<=0){
                    figcaption = '';
                }
                return $('<div class="row" />')
                    .append($('<div class="col-xs-12" />')
                        .append($('<figure />')
                            .append(img)
                            .append(figcaption)
                        )
                    )
            })
        }
        // add img-responsive tags to images
        img.addClass('img-responsive');
    })

    // add a heading to our footnotes
    $('section.footnotes').prepend('<h2 class="footnotes-title">Footnotes</h2>');


    $('table').each(function(){
        var table = $(this);
        // add bootstrap styles to tables
        table.replaceWith(function(){
            return $('<div class="container" />').append($('<table class="table table-striped" />').append($(this).contents()))
        })
    })


    // add legal-style numbers to each heading on certain content types
    if(meta && meta.collection && 
        (meta.collection.indexOf('_reports')>-1 || meta.slug === "frequently-asked-questions")
    ){
        var headingIndex = [0,0,0,0,0,0,0];
        $('h2,h3,h4,h5,h6').each(function(){
            var heading = $(this);
            var tag = heading[0].name;
            var level = parseInt(tag.charAt(1))
            headingIndex[level+1] = 0;
            headingIndex[level]++;
            var index = headingIndex.slice(2,level+1)
            heading.prepend("<span class='index'>"+index.join('.')+". </span>")
            heading.addClass('indexed')
        })
    }

    html = $.html();
    // typogr
    html = typogr.typogrify(html)

    // save back to the main metalsmith array
    return html;

} 