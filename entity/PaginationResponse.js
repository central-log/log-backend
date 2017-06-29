var PaginationResponse = function (data, page, pageSize, totalCount) {
  return {
      data: data,
      page: page,
      pageSize: pageSize,
      totalCount: totalCount
  }
}

module.exports = PaginationResponse;
