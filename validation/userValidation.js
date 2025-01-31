const Joi = require("joi");

const updateUserProfile = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().optional(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .optional(),
    });
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const schema = Joi.object({
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
      search: Joi.number().optional(),
    });
    req.query = await schema.validateAsync(req.query);
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getUserById = async (req, res, next) => {
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

const deleteUserById = async (req, res, next) => {
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
  getAllUser,
  getUserById,
  deleteUserById,
  updateUserProfile,
};


// [
//   {
//     $match: {
//       patient: ObjectId(
//         "67985cacc322e051143d2eb3"
//       )
//     }
//   },
//   {
//     $lookup: {
//       from: "patients",
//       localField: "patient",
//       foreignField: "_id",
//       as: "patientData"
//     }
//   },
//   {
//     $lookup: {
//       from: "doctors",
//       localField: "doctor",
//       foreignField: "_id",
//       as: "doctorData"
//     }
//   }
// ]