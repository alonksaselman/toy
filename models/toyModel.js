const mongoose = require("mongoose");
const Joi = require("joi");

let toySchema = new mongoose.Schema({
  name:String,
  info:String,
  category:String,
  img_url:String,
  price:Number,
  user_id:String,
  date_created:{
    type:Date , default:Date.now()
  }
});

exports.ToyModel = mongoose.model("toys", toySchema);

exports.validTOY = (_bodyData) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(100).required(),
    info:Joi.string().min(2).max(50).required(),
    category:Joi.string().min(2).max(500).required(),
    img_url:Joi.string().min(2).max(100),
    price:Joi.number().min(1).max(10000).required()
  });

  return joiSchema.validate(_bodyData);
}