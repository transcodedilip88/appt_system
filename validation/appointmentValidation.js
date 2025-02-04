const Joi = require("joi");

const bookAppointment = async (req, res, next) => {
  try {
    const schema = Joi.object({
      doctor: Joi.string().required(),
      appointmentTime: Joi.date(),
    });
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getAllAppointments = async (req, res, next) => {
  try {
    const schema = Joi.object({
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
      patient: Joi.string().optional(),
      status: Joi.string().optional(),
      doctor: Joi.string().optional(),
      startTime: Joi.string().optional(),
      endTime: Joi.string().optional(),
    });
    req.query = await schema.validateAsync(req.query);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getAppointmentById = async (req, res, next) => {
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

const updateAppointment = async (req, res, next) => {
  try {
    const schema = Joi.object({
      appointmentTime: Joi.date().optional(),
      status: Joi.string().optional(),
    });
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const deleteAppointment = async (req, res, next) => {
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
  bookAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
