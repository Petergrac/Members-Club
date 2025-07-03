const { body } = require("express-validator");
const db = require("../database/query");

// Error messages
const alphaError = "Name must contain letters";
const lengthError = "Must be between 2 and 10 characters";
const validateUser = [
  body("firstName").trim().bail().isAlpha().withMessage(`${alphaError}`),
  body("lastName").trim().bail().isAlpha().withMessage(`${alphaError}`),
  body("email")
    .trim()
    .bail()
    .isEmail()
    .withMessage("Enter a valid email")
    .custom(async (value) => {
      const  email = await db.checkEmail(value);
      if (email) {
        throw new Error("Email already in use");
      }
    }).bail(),
  body("password")
    .trim()
    .isLength({ min: 2, max: 10 })
    .withMessage(`${lengthError}`),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

module.exports = validateUser;
