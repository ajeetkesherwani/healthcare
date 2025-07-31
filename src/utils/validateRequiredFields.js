const AppError = require("./AppError");

/**
 * Validates an array of fields and throws the first encountered error.
 * @param {Array} fields - Array of objects with shape { field, name }
 * @param {Function} next - Express next() function for error handling
 */
const validateRequiredFields = (fields, next) => {
  for (const { field, name } of fields) {
    if (
      field === undefined ||
      field === null ||
      (typeof field === "string" && !field.trim())
    ) {
      return next(new AppError(`${name} is required.`, 400));
    }
  }
};

module.exports = validateRequiredFields;
