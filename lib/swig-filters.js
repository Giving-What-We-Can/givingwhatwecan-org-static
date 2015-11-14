
var truncate = require('truncate')
var autolinker = require('autolinker')
var strip = require('strip')

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
            name:   'truncate',
            filter: truncate
        },
        { 
            name:   'autolinker',
            filter: autolinker.link
        },
        { 
            name:   'strip',
            filter: strip
        },
        { 
            name:   'embed',
            filter: function(input,aspectratio){
                aspectratio = aspectratio === '4by3' ? '4by3' : '16by9';
                var output = []
                output.push('<div class="embed-responsive embed-responsive-'+aspectratio+'">')
                output.push('<iframe class="embed-responsive-item" src="'+input+'"></iframe>')
                output.push('</div>')
                return output.join('\n')
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