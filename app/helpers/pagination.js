module.exports.input = function (req) {

    return {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.pageSize),
        sort: createSortObject(req.params.sortBy, req.params.sortDirection)
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
