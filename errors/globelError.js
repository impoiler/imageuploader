exports.Error = (res, message, code) => {
  return res.status(code).json({
    staus: "failed",
    message: message,
  });
};
