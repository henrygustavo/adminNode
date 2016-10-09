module.exports.input = function (req) {

    return {
        page: req.param('page') == null ? 1 : parseInt(req.param('page')),
        limit: req.param('pageSize') == null ? 10 :parseInt(req.param('pageSize')),
        sort: createSortObject(req.param('sortBy'), req.param('sortDirection'))
    };
};

module.exports.output = function (results) {

    return {
      'content': results.docs,
      'totalRecords': results.total,
      'currentPage' : results.page,
      'pageSize' : results.limit,
      'totalPages' : results.pages
    };
};

module.exports.dictionary = function (results) {

var Enumerable = require('linq');


    return {
      'content': results.docs,
      'totalRecords': results.total,
      'currentPage' : results.page,
      'pageSize' : results.limit,
      'totalPages' : results.pages
    };
};

function createSortObject(sortBy, sortDirection) {

  if(sortBy == null || sortDirection == null) return {};

    var sortObject = {};

    sortObject[sortBy] = sortDirection;

    return sortObject;

}

module.exports.CreateDictionaryList = function (result, value, text){
  var dict  =[];
  dict.push({  value:   "",  text: "--- Seleccionar ---"});
 console.log(result);
  for(var i = 0; i < result.length; ++i) {

    dict.push({  value:   result[i][value],  text: result[i][text]});
}

  return dict;

}
