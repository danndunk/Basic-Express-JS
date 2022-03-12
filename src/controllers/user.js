const { user } = require("../../models");

exports.getUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      where: {
        role: "user",
      },
      attributes: {
        exclude: ["password", "role", "createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "success",
      data: {
        users: users,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await user.destroy({
      where: { id },
    });

    res.status(200).send({
      status: "success",
      data: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
