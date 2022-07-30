const express = require("express");
const ejs = require("ejs");
const loadRegister = require("../controllers/userController.js");
const userRoute = express();
const body_parser = require("body-parser");
userRoute.use(body_parser.json());
userRoute.use(body_parser.urlencoded({ extended: true }));
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/userImage");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

userRoute.set("view engine", "ejs");
userRoute.set("views", "./views/user");
userRoute
  .route("/register")
  .get(loadRegister.loadRegister)
  .post(upload.single("img"), loadRegister.updateUser);
userRoute
  .route("/login")
  .get(loadRegister.loginpage)
  .post(loadRegister.postLogin);
module.exports = userRoute;
