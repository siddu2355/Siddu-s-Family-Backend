const express = require("express");
const { Catogery, validateCatogery } = require("../models/catogery");
const permission = require("../middleware/permission");
const admin = require("../middleware/admin");
const router = express.Router();

router.get("/", async (req, res) => {
  const catogeries = await Catogery.find().select("-__v");
  res.send(catogeries);
});

router.get("/:id", async (req, res) => {
  const catogery = await Catogery.findById(req.params.id).select("-__v");
  if (!catogery)
    return res.status(404).send(`no catogery with such id:${req.params.id}`);
  res.send(catogery);
});

router.post("/", permission, async (req, res) => {
  const { error } = validateCatogery(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let catogery = new Catogery({
    name: req.body.name,
  });
  catogery = await catogery.save();
  res.send(catogery);
});

router.put("/:id", permission, async (req, res) => {
  catogery = await Catogery.findById(req.params.id);
  if (!catogery)
    res.status(404).send(`no catogery with such id:${req.params.id}`);
  const { error } = validateCatogery(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  catogery.set({
    name: req.body.name,
  });
  catogery = await catogery.save();
  res.send(catogery);
});

router.delete("/:id", [permission, admin], async (req, res) => {
  catogery = await Catogery.findByIdAndRemove(req.params.id);
  if (!catogery)
    res.status(404).send(`no catogery with such id:${req.params.id}`);
  res.send(catogery);
});
module.exports = router;
