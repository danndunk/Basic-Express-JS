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

const { uploadImage } = require("../middlewares/uploadImage");

const {
  addTransaction,
  getTransactions,
  getTransaction,
  editTransaction,
} = require("../controllers/transaction");

router.post("/register", register);
router.post("/login", login);

router.get("/users", getUsers);
router.delete("/user/:id", deleteUser);

router.post("/book", auth, uploadFile("bookFile"), addBook);
router.get("/books", getBooks);
router.get("/book/:id", getDetailBook);
router.patch("/book/:id", auth, uploadFile("bookFile"), updateBook);

router.delete("/book/:id", auth, deleteBook);

router.post("/transaction", auth, uploadImage("transferProof"), addTransaction);
router.get("/transactions", getTransactions);
router.get("/transaction/:id", getTransaction);
router.patch("/transaction/:id", auth, editTransaction);

module.exports = router;
