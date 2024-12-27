const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auths");
const multer = require("../middlewares/multer-config");
const bookCtrl = require("../controllers/book");

// add book
router.post("/", auth, multer, bookCtrl.addBook);
// modify book
router.put("/:id", auth, bookCtrl.updateBook);
// remove book
router.delete("/:id", auth, bookCtrl.deleteBook);
// get specific book
router.get("/:id", bookCtrl.selectBook);
// get all books
router.get("/", bookCtrl.getAllBooks);

module.exports = router;

