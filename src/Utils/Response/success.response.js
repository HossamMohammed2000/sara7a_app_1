export const successResponse = (res, statusCode, message, data) => {
  return res.status(statusCode).json({ message, data });
};
