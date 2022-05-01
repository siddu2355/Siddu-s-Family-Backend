const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");
const permission = require("../middleware/permission");
const admin = require("../middleware/admin");
const { catogerySchema, Catogery } = require("../models/catogery");
const router = express.Router();

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  age: { type: Number, required: true, min: 1, max: 110 },
  gender: { type: String, required: true },
  catogery: { type: catogerySchema, required: true },
  desc: { type: String, required: true, maxlength: 2550 },
  phone: { type: String, maxlength: 10 },
  image: { type: String, maxlength: 1024 },
});

const Member = mongoose.model("member", memberSchema);

router.get("/", async (req, res) => {
  const members = await Member.find().select("-__v").sort("name");
  res.send(members);
});

router.get("/:id", async (req, res) => {
  const member = await Member.findById(req.params.id).select("-__v");
  if (!member)
    return res
      .status(404)
      .send(
        `There is no member with such id ${req.params.id} in the data base...`
      );
  res.send(member);
});

router.post("/", [permission], async (req, res) => {
  const { error } = validateMember(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let catogery = await Catogery.findById(req.body.catogeryId);
  if (!catogery) return res.status(400).send("Invalid Catogery Id");

  let member = new Member({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    catogery: {
      _id: catogery._id,
      name: catogery.name,
    },
    desc: req.body.desc,
    phone: req.body.phone,
    image: req.body.image,
  });
  member = await member.save();
  res.send(member);
});
router.put("/:id", [permission], async (req, res) => {
  const { error } = validateMember(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let catogery = await Catogery.findById(req.body.catogeryId);
  if (!catogery)
    return res
      .status(404)
      .send(
        `There is no catogery with such id ${req.params.id} in the data base...`
      );
  const member = await Member.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    catogery: {
      _id: catogery._id,
      name: catogery.name,
    },
    desc: req.body.desc,
    phone: req.body.phone,
    image: req.body.image,
    new: true,
  });
  if (!member)
    return res
      .status(404)
      .send(
        `There is no family member with such id ${req.params.id} in the data base...`
      );
  member = await member.save();
  res.send(member);
});
router.delete("/:id", [permission, admin], async (req, res) => {
  const member = await Member.findByIdAndRemove(req.params.id);
  if (!member)
    return res
      .status(404)
      .send(
        `There is no member with such id ${req.params.id} in the data base...`
      );
  res.send(member);
});

function validateMember(member) {
  const schema = {
    name: Joi.string().min(5).max(255).required(),
    age: Joi.number().min(1).max(110).required(),
    gender: Joi.string().max(6).required(),
    catogeryId: Joi.string().required(),
    desc: Joi.string().max(2550).required(),
    phone: Joi.string().max(10).required(),
    image: Joi.string().max(1024),
  };
  return Joi.validate(member, schema);
}
module.exports = router;
