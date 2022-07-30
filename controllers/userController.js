const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config({ path: "../config/.env" });
//bcrypt password
const securePassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (error) {
    console.log(error.message);
  }
};
//load front register
const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};

//check validation and update to mongodb
const updateUser = async (req, res) => {
  try {
    let errors = [];
    const { name, email, mno, img, password, confirm_password } = req.body;

    if (req.body.mno.length != 10 && typeof req.body.mno != Number) {
      errors.push({ msg: "Mobile no should be number and 10 digit long" });
    }
    if (req.body.password != req.body.confirm_password) {
      errors.push({ msg: "Password doesnot match" });
    }
    if (errors.length > 0) {
      res.render("registration", {
        name,
        errors,
        email,
        mno,
        img,
      });
    } else {
      res.render("registration", {
        messageVerify: "Account has been registered. Please verify your email.",
      });
      const spassword = await securePassword(req.body.password);
      const userDataModel = new userModel({
        name: req.body.name,
        email: req.body.email,
        mobile_no: req.body.mno,
        password: spassword,
        image: req.file.filename,
        is_admin: 0,
      });
      //save to mongodb
      //send mail
      const forMailVerify = mailVerify(req.body.name, req.body.email);
      if (forMailVerify) {
        userDataModel.save();
      } else {
        console.log("error while saving the given mail to database");
      }

      // if (userData) {
      //   res.render("login");
      // } else {
      //   res.render("errorpage");
      // }
    }
  } catch (error) {
    res.send(error.message);
  }
};
//loginpage templete function
const loginpage = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    res.render("errorpage");
  }
};
//login page validation
const postLogin = async (req, res) => {
  try {
    // const passwordDecrypt = bcrypt.compare(req.body);

    const userData = await userModel.findOne({
      name: { $exists: true, $eq: req.body.name },
    });
    if (userData != null) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        userData.password
      );

      console.log(passwordMatch);
      if (passwordMatch) {
        res.render("main", { name: req.body.name });
      }
    } else {
      res.render("login", {
        invalidLogin: "Invalid login.. enter correct username and password",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//mail verify function
const mailVerify = async (name, email, id) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.smtpHost,
      port: process.env.smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.smtpUser, // generated ethereal user
        pass: process.env.smtpPassword, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "surajbillionare@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Verification mail ", // Subject line
      text: "Hello world?", // plain text body
      html: `<P>Hii ${name},please click here to <a href="http://127.0.0.1:${process.env.PORT}/login?id=${id}">Verify</a> your mail.</p>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  loadRegister,
  updateUser,
  loginpage,
  postLogin,
};
