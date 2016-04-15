
var truncate = require('truncate');
var autolinker = require('autolinker');
var strip = require('strip');
var slug = require('slug'); slug.defaults.mode = 'rfc3986';
var numeral = require('numeral');
var moment = require('moment');

module.exports = function(swig){

    var filters = [
        { 
            name:   'contains',
            filter: function(arr, value, field) {
                if(Array.isArray(arr)){
                    return arr.indexOf(value) !== -1;
                } else if (arr[field]===value) {
                    return true;
                }
                return false;
            }
        },
        { 
            name:   'separateThousands',
            filter: function(input) {
              return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        { 
            name:   'numeral',
            filter: function(input,format){
                format = format || '0,0';
                return numeral(input).format(format);
            }
        },
        { 
            name:   'truncate',
            filter: truncate
        },
        { 
            name:   'autolinker',
            filter: function(input,newWindow) { 
                newWindow = newWindow || false;
                return autolinker.link(input,{newWindow:newWindow,stripPrefix:false})
            }
        },
        { 
            name:   'strip',
            filter: strip
        },
        { 
            name:   'slug',
            filter: slug
        },
        { 
            name:   'moment',
            filter: function(){
                if (arguments.length === 2 ){
                    return moment(arguments[0]).format(arguments[1]);
                } else if (arguments.length === 3) {
                    return moment(arguments[0],arguments[1]).format(arguments[2]);
                }
                else {
                    return arguments[0];
                }
            }
        },
        { 
            name:   'embed',
            filter: function(input,aspectratio,caption){
                aspectratio = aspectratio === '4by3' ? '4by3' : '16by9';
                var output = []
                output.push('<figure>');
                output.push('<div class="embed-responsive embed-responsive-'+aspectratio+'">')
                output.push('<iframe class="embed-responsive-item" src="'+input+'"></iframe>')
                output.push('</div>')
                if(caption){
                    output.push('<figcaption>');
                    output.push(caption);
                    output.push('</figcaption>');
                }
                output.push('</figure>');
                return output.join('\n')
            }
        },
        { 
            name:   'childActive',
            filter: function(page,path){
                var childActive = false;
                for (child in page._children){
                    if(child.path === path){
                        childActive = true;
                        break
                    }
                }
                return childActive;
            }
        }
    ]

    // add the filters to swig
    filters.forEach(function(filter){
        swig.setFilter(filter.name,filter.filter)
    })


    // turn off auto escaping
    swig.setDefaults({autoescape:false})


}