const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../Validation");
//validation

router.post("/register", async (req, res) => {
  // lets validate the data before we a user
  //const {error} = Joi.validate(req.body,schema);
  const { error } = registerValidation(req.body);
  //res.send(error.details[0].message);
  if (error) return res.status(400).send(error.details[0].message);
  //res.send("Register");

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //check user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exist");
  //crate new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });
  try {
    const saveUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //check email is already exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found");
  const valiPassword = await bcrypt.compare(req.body.password, user.password);
  if (!valiPassword) return res.status(400).send("Password invalid");

  //create a assign a token

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
 
});
module.exports = router;
