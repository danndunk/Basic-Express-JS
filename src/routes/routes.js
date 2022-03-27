const express = require("express");

const router = express.Router();

const { register } = require("../controllers/register");

const { login } = require("../controllers/login");

const { checkAuth } = require("../controllers/checkAuth");

const { getUsers, deleteUser } = require("../controllers/user");

const {
  addBook,
  getBooks,
  getDetailBook,
  updateBook,
  deleteBook,
} = require("../controllers/book");

const { getListUser, addList } = require("../controllers/listUser");

const { auth } = require("../middlewares/auth");

const { authAdmin } = require("../middlewares/authAdmin");

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
router.get("/check-auth", auth, checkAuth);

router.get("/users", getUsers);
router.delete("/user/:id", deleteUser);

router.post(
  "/book",
  auth,
  authAdmin,
  uploadFile("bookFile", "bookCover"),
  addBook
);
router.get("/books", getBooks);
router.get("/book/:id", getDetailBook);
router.patch(
  "/book/:id",
  auth,
  authAdmin,
  uploadFile("bookFile", "bookCover"),
  updateBook
);
router.delete("/book/:id", auth, authAdmin, deleteBook);

router.post("/transaction", auth, uploadImage("transferProof"), addTransaction);
router.get("/transactions", getTransactions);
router.get("/transaction/:id", getTransaction);
router.patch("/transaction/:id", auth, authAdmin, editTransaction);

router.get("/list-user", auth, getListUser);
router.post("/list-user/:id", auth, addList);

module.exports = router;
