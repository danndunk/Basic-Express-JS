const { user } = require("../../models");

const Joi = require("joi");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().min(5).required(),
      password: Joi.string().min(6).required(),
      // .messages({
      //   'string.empty:"password ga boleh kosong"
      // })
      fullname: Joi.string().min(5).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(200).send({
        status: "error",
        message: error.details[0].message,
      });
    }

    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (userExist) {
      return res.status(200).send({
        status: "failed",
        message: "email has already taken",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
      email: req.body.email,
      password: hashedPassword,
      fullname: req.body.fullname,
      role: "user",
    });

    const dataToken = {
      id: newUser.id,
      email: newUser.email,
    };

    const SECRET_KEY = process.env.TOKEN_KEY;

    const token = jwt.sign(dataToken, SECRET_KEY);

    res.status(200).send({
      status: "success",
      data: {
        user: {
          email: newUser.email,
          token: token,
        },
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
