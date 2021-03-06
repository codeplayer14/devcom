const Validator = require("validator");
const isEmpty = require("./isEmpty");
module.exports = data => {
  let errors = {};
  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 to 30 characters";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is not correct";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
