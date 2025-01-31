const Joi = require("joi");

const register = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      phone: Joi.string()
        .pattern(new RegExp("^[+]{1}(?:[0-9]){6,15}[0-9]{1}$"))
        .required(),
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

module.exports = {
  register,
  login,
  logout,
};
