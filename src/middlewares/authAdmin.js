const { user } = require("../../models");

exports.authAdmin = (req, res, next) => {
  const getId = req.user.id;

  console.log(getId);
  const getData = user.findOne({
    where: {
      id: getId,
    },
  });

  getData.then((result) => {
    if (result.dataValues.role == "admin") {
      return next();
    } else {
      return res.status(200).send({
        message: "you must be admin",
      });
    }
  });
};
