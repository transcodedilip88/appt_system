const Joi = require("joi");
const { verifyToken } = require("../middleware/authentication");

const register = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        )
        .optional()
        .messages({ "string.pattern.base": "Password is not strong" }),
      phone: Joi.object({
        countryCode: Joi.string(),
        mobileNumber: Joi.string(),
      }),
      role: Joi.string(),
    });
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const logout = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      token: Joi.string().required(),
    });
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const schema = Joi.object({
      verifyToken: Joi.string().optional(),
      newPassword: Joi.string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        )
        .required()
        .messages({ "string.pattern.base": "Password is not strong" }),
    });
    const value = await schema.validateAsync(req.body);
    req.body = value;
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verify = async (req, res, next) => {
  try {
    const schema = Joi.object({
      verifyToken: Joi.string().required(),
      otp: Joi.number().required(),
    });
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verify
};

