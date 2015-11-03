

module.exports = function(swig){

    var filters = [
        { 
            name:   'contains',
            filter: function(arr, value) {
              return arr.indexOf(value) !== -1;
            }
        },
        { 
            name:   'separateThousands',
            filter: function(input) {
              return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
    ]

    // add the filters to swig
    filters.forEach(function(filter){
        swig.setFilter(filter.name,filter.filter)
    })

}