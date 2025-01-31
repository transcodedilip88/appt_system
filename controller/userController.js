const usermodel = require("../models/userModel");

exports.updateUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await usermodel.findByIdAndUpdate(
      id,
      req.body,
      { isBlocked: true, isDeleted: true },
      { new: true }
    );
    if (data === null) {
      return res.status(401).json({ status: "id not found" });
    }
    res.status(200).json({ status: "sucess", data });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const documents = await usermodel
      .find({ isBlocked: false, isDeleted: false })
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
    const data = await usermodel.findById(id, {
      isBlocked: false,
      isDeleted: false,
    });

    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.headers.authorization.split(" ")[1];
    let decode = jwt.verify(token, config.SECRET);
    let role = decode.role;
    if (role == "patient") {
      return res.status(401).json({ status: "Admin not found" });
    }

    const data = await usermodel.findByIdAndUpdate(id, {
      isBlocked: true,
      isDeleted: true,
    });
    res.status(200).json({ status: "delete success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
