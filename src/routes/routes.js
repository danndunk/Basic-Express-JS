const express = require("express");

const router = express.Router();

const { register } = require("../controllers/register");
const { login } = require("../controllers/login");
const { getUsers, deleteUser } = require("../controllers/user");
const {
  addBook,
  getBooks,
  getDetailBook,
  updateBook,
  deleteBook,
} = require("../controllers/book");
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");
const { addTransaction } = require("../controllers/transaction");

router.post("/register", register);
router.post("/login", login);

router.get("/users", getUsers);
router.delete("/user/:id", deleteUser);

router.post("/book", auth, uploadFile("bookFile"), addBook);
router.get("/books", getBooks);
router.get("/book/:id", getDetailBook);
router.patch("/book/:id", auth, updateBook);
router.delete("/book/:id", auth, deleteBook);

router.post("/transaction", addTransaction);

module.exports = router;
