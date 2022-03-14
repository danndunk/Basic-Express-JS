const { user } = require("../../models");

exports.authAdmin = (req, res, next) => {
  const getId = req.user.id;

  const getData = user.findOne({
    where: {
      id: getId,
    },
  });

  getData.then((result) => {
    if (
      result.dataValues.role === "admin" ||
      result.dataValues.role === "Admin"
    ) {
      return next();
    } else {
      return res.status(400).send({
        message: "only admin can do it",
      });
    }
  });
};
