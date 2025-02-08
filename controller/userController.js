const usermodel = require("../models/userModel");

exports.updateUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    let { name, password } = req.body;

    if (password) {
      const passwordHash = await universalFunctions.encryptData(password);
      body.password = passwordHash;
    }

    let updateUser = {
      name,
      password: body?.password,
    };

    let body = req.body;
    const userdata = await usermodel.findByIdAndUpdate(id, updateUser, {
      new: true,
    });
    if (userdata === null) {
      return res.status(401).json({ status: "id not found" });
    }
    res.status(200).json({ status: "sucess", userdata });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    let { name, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let isAdmin = req.user.role;

    let matchConditions = {
      isDeleted: false,
    };

    if (name) {
      matchConditions.name = name;
    }

    if (search) {
      matchConditions.$or = [{ email: { $regex: search, $options: "i" } }];
    }

    const documents = await usermodel
      .find(matchConditions)
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ status: "doctor List", documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    let userCriteria = {
      _id: id,
      isDeleted: false,
    };

    const users = await doctorModel.findById(userCriteria);

    if (!users) {
      throw new errors.NotFound(messages.DATA_NOT_FOUND);
    }

    let response = {
      data: users,
    };

    res.status(200).send({ message: messages.SUCCESS, response });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const userdata = await usermodel.findByIdAndUpdate(id, {
      isBlocked: true,
      isDeleted: true,
    });
    res.status(200).json({ status: "delete success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
