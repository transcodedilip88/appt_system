const Joi = require("joi");

const addDoctor = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      specialization: Joi.string().required(),
      phone: Joi.string()
        .pattern(new RegExp("^[+]{1}(?:[0-9]){6,15}[0-9]{1}$"))
        .required(),
      availability: Joi.object().required(),
    });
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getAllDoctor = async (req, res, next) => {
  try {
    const schema = Joi.object({
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
      search: Joi.string().optional(),
      name:Joi.string().optional(),
      email:Joi.string().optional(),
      specialization:Joi.string().optional()
    });
    req.query = await schema.validateAsync(req.query);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const schema = Joi.object({
      id: Joi.string().required(),
    });
    req.params = await schema.validateAsync(req.params);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const updateDoctorById = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
      specialization: Joi.string().optional(),
      phone: Joi.string().optional(),
      availability: Joi.object().optional(),
      isBlocked: Joi.boolean().optional(),
      isDeleted: Joi.boolean().optional(),
    });
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const deleteDoctorById = async (req, res, next) => {
  try {
    const schema = Joi.object({
      id: Joi.string().required(),
    });
    req.params = await schema.validateAsync(req.params);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  addDoctor,
  getAllDoctor,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
};
