var InternalErrorResponse = function (message) {
  return {
    "respCode": "_"+500,
    "errMsg": message?message:'服务器操异常'
  }
}

module.exports = InternalErrorResponse;
