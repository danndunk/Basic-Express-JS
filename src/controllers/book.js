const { book } = require("../../models");

let month = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "July",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function getMMYYYY(d) {
  let date = new Date(d);
  let monthIndex = date.getMonth();
  let year = date.getFullYear();

  return `${month[monthIndex]} ${year}`;
}

exports.addBook = async (req, res) => {
  try {
    const { ...data } = req.body;

    const newBook = await book.create({
      ...data,
      bookFile: req.file.filename,
    });

    let dataBook = await book.findOne({
      where: {
        id: newBook.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    dataBook = JSON.parse(JSON.stringify(dataBook));

    res.status(200).send({
      status: "success...",
      data: {
        ...dataBook,
        publicationDate: getMMYYYY(dataBook.publicationDate),
        bookFile: "http://localhost:5000/uploads/" + dataBook.bookFile,
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

exports.getBooks = async (req, res) => {
  try {
    const books = await book.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    let bookData = books.map((item) => {
      return {
        ...item.dataValues,
        publicationDate: getMMYYYY(item.publicationDate),
      };
    });

    // console.log(bookData);

    res.status(200).send({
      status: "success",
      data: {
        books: bookData,
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

exports.getDetailBook = async (req, res) => {
  try {
    const { id } = req.params;
    const detailBook = await book.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "success",
      data: {
        book: detailBook,
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

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

    const newData = {
      ...data,
      bookFile: req.file.filename,
    };

    await book.update(newData, {
      where: {
        id,
      },
    });

    let bookData = await book.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    bookData = JSON.parse(JSON.stringify(bookData));

    res.status(200).send({
      status: "success",
      data: {
        book: {
          ...bookData,
          publicationDate: getMMYYYY(bookData.publicationDate),
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

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    await book.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      data: {
        id,
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
