module.exports.input = function (req) {

    return {
        page: parseInt(req.param('page')),
        limit: parseInt(req.param('pageSize')),
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

function createSortObject(sortBy, sortDirection) {
    var sortObject = {};
    sortObject[sortBy] = sortDirection;

    return sortObject;

}
