const { book } = require("../../models");

exports.addBook = async (req, res) => {
  try {
    const { title, publicationDate, pages, author, isbn, about } = req.body;

    function getMMYYYY(d) {
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

      let date = new Date(d);
      let monthIndex = date.getMonth();
      let year = date.getFullYear();

      return `${month[monthIndex]} ${year}`;
    }

    const newBook = await book.create({
      title: title,
      publicationDate: publicationDate,
      pages: pages,
      author: author,
      isbn: isbn,
      about: about,
      bookFile: req.file.filename,
    });

    res.status(200).send({
      status: "success...",
      data: {
        title: newBook.title,
        publicationDate: getMMYYYY(newBook.publicationDate),
        pages: newBook.pages,
        author: newBook.author,
        isbn: newBook.isbn,
        about: newBook.about,
        bookFile: newBook.bookFile,
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

    res.status(200).send({
      status: "success",
      data: {
        books,
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
    const newData = req.body;

    await book.update(newData, {
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      data: {
        book: newData,
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
