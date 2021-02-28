const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {UserModel, validLogin, genToken, validUser} = require("../models/userModel");
const {authToken} = require("../middleware/auth");
const { json } = require("express");

const router = express.Router();


router.get('/', async(req, res) => {
  try{
    let data = await UserModel.find({},{pass:0})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
    }
});

router.get('/myInfo', authToken ,async(req,res) => {
  try{
    let user = await UserModel.findOne({_id:req.userData._id},{pass:0});
    res.json(user);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


router.post('/login',async(req,res) => {
  let validBody = validLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = await UserModel.findOne({email:req.body.email});
    if(!user){
      return res.status(400).json({msg:"user or password is invalid"});
    }
    let validPass = await bcrypt.compare(req.body.pass,user.pass);
    if(!validPass){
      return res.status(400).json({msg:"user or password is invalid"});  
    }
    let userToken = genToken(user._id);
    res.json({token:userToken});
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post('/', async(req,res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);
    let salt = await bcrypt.genSalt(10);
    user.pass = await bcrypt.hash(user.pass, salt);
    await user.save();
    res.status(201).json(_.pick(user,["_id", "user", "email", "date_created"]))
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
