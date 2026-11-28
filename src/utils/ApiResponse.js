class ApiResponse {
  static success(res, payload, statusCode = 200) {
    return res.status(statusCode).json({ success: true, ...payload });
  }

  static error(res, message, statusCode = 500) {
    return res.status(statusCode).json({ success: false, message });
  }
}

module.exports = ApiResponse;
