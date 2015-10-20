module.exports = function(swig){

    var filters = [
        { 
            name:   'contains',
            filter: function(arr, value) {
              return arr.indexOf(value) !== -1;
            }
        }
    ]

    // add the filters to swig
    filters.forEach(function(filter){
        swig.setFilter(filter.name,filter.filter)
    })

}