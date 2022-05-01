const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Joi = require("joi");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password...");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid email or password...");
  const token = user.generateAuthToken();
  res.send(token);
});

function validateUser(user) {
  const schema = {
    email: Joi.string().min(10).max(255).required(),
    password: Joi.string().min(5).max(1024).required(),
  };
  return Joi.validate(user, schema);
}
module.exports = router;
