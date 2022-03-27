const { user, book, listUser } = require("../../models");

exports.getListUser = async (req, res) => {
  try {
    const { id } = req.user;

    let data = await book.findAll({
      include: [
        {
          model: user,
          as: "user",
          through: {
            model: listUser,
            as: "bridge",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          where: {
            id,
          },
          attributes: [],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        bookFile: process.env.PATH_FILE + item.bookFile,
        bookCover: process.env.PATH_FILE + item.bookCover,
      };
    });

    // let data = await user.findAll({
    //   where: {
    //     id: req.user.id,
    //   },
    //   include: {
    //     model: book,
    //     as: "book",
    //     through: {
    //       model: listUser,
    //       as: "bridge",
    //       attributes: [],
    //     },
    //     attributes: {
    //       exclude: ["createdAt", "updatedAt"],
    //     },
    //   },
    //   attributes: {
    //     exclude: ["password", "role", "createdAt", "updatedAt"],
    //   },
    // });

    // getUser = JSON.parse(JSON.stringify(getUser));
    // let dataBook = getUser[0].book.map((item) => {
    //   return {
    //     ...item,
    //     bookFile: process.env.PATH_FILE + item.bookFile,
    //     bookCover: process.env.PATH_FILE + item.bookCover,
    //   };
    // });

    res.status(200).send({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.addList = async (req, res) => {
  try {
    const { id } = req.params;

    const list = await listUser.create({
      userID: req.user.id,
      bookID: id,
    });

    res.status(200).send({
      status: "success",
      data: {
        list,
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
