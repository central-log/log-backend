var PaginationResponse = function (data, page, pageSize, totalCount) {
  return {
    respCode: "_200",
    result: {
      data: data,
      page: page,
      pageSize: pageSize,
      totalCount: totalCount
    }
  }
}

module.exports = PaginationResponse;
