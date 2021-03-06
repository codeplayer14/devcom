const Validator = require("validator");
const isEmpty = require("./isEmpty");
module.exports = data => {
  let errors = {};
  data.email = isEmpty(data.email) ? "" : data.email;

  data.password = isEmpty(data.password) ? "" : data.password;
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 to 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 to 30 characters";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords dont match";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
