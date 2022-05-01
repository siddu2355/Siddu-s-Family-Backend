const mongoose = require("mongoose");
const Joi = require("joi");

const catogerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Infant", "Kid", "Teenager", "Adult", "Senior Citizen"],
  },
});

const Catogery = mongoose.model("catogery", catogerySchema);

function validateCatogery(catogery) {
  const schema = {
    name: Joi.string().required(),
  };
  return Joi.validate(catogery, schema);
}

module.exports.catogerySchema = catogerySchema;
module.exports.validateCatogery = validateCatogery;
module.exports.Catogery = Catogery;
