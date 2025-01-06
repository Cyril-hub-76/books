const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auths");
const multer = require("../middlewares/multer-config");
const bookCtrl = require("../controllers/book");

// get all books
router.get("/", bookCtrl.getAllBooks);
// best rating
router.get("/bestrating", bookCtrl.getBestRating);
// get specific book
router.get("/:id", bookCtrl.selectBook);
// add book
router.post("/", auth, multer, bookCtrl.addBook);
// modify book
router.put("/:id", auth, multer ,bookCtrl.updateBook);
// remove book
router.delete("/:id", auth, bookCtrl.deleteBook);
// rate book
router.post("/:id/rating", auth, bookCtrl.rating);
module.exports = router;

