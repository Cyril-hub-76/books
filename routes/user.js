const express = require("express");
// token transmiter
const auth = require("../middlewares/auths");
//router from express implementation
const router = express.Router();

const userController = require("../controllers/user");

// dont forget to add "auth" transmiter to routers
router.post("/signup", userController.signup);
router.post("/login", userController.login);
module.exports = router;