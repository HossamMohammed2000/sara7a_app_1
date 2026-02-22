export const errorResponse = (
  message = "Error",
  statusCode = 400,
  extra = undefined,
) => {
  const error = new Error(
    typeof message === "string" ? message : message?.message || "Error",
  );
  error.statusCode = statusCode;
  error.extra = extra;
  throw error;
};

export const badRequestException = (
  message = "bad request",
  extra = undefined,
) => {
  return errorResponse(message, 400, extra);
};

export const conflictException = (
  message = "conflict exception",
  extra = undefined,
) => {
  return errorResponse(message, 409, extra);
};

export const unauthorizedException = (
  message = "unauthorized",
  extra = undefined,
) => {
  return errorResponse(message, 401, extra);
};
export const notFoundException = (message = "not found", extra = undefined) => {
  return errorResponse(message, 404, extra);
};

export const forbiddenException = (
  message = "forbidden",
  extra = undefined,
) => {
  return errorResponse(message, 403, extra);
};

export const globalErrorHandler = (err, req, res, next) => {
  // لو err.statusCode مش موجود أو مش رقم صالح
  const status = Number(err?.statusCode) || 500;

  return res.status(status).json({
    message: err?.message || "Internal Server Error",
    stack: err?.stack,
    statusCode: status
  });
};

