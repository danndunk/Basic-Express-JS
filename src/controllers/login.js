const { user } = require("../../models");

const Joi = require("joi");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);

    if (error)
      return res.status(200).send({
        message: error.details[0].message,
      });

    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const isValid = await bcrypt.compare(req.body.password, userExist.password);

    if (!isValid) {
      return res.status(200).send({
        status: "failed",
        message: "email or password doesnt match",
      });
    }

    const dataToken = {
      id: userExist.id,
      email: userExist.email,
    };

    const SECRET_KEY = process.env.TOKEN_KEY;

    const token = jwt.sign(dataToken, SECRET_KEY);

    res.status(200).send({
      status: "success",
      data: {
        id: userExist.id,
        email: userExist.email,
        fullname: userExist.fullname,
        role: userExist.role,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      status: "failed",
      message: "account is not registered",
    });
  }
};
