const express = require('express');
const { authToken } = require("../middleware/auth")
const { ToyModel,validTOY} = require("../models/toyModel")

const router = express.Router();

router.get("/", async (req, res) => {
    let qSearch = req.query.s;
    let qRegExp = new RegExp(qSearch, "i")
    let perPage = (req.query.perPage) ? Number(req.query.perPage) : 10;
    let page = req.query.page;
    let sortQ = (req.query.sort) ? (req.query.sort) : "_id";
    let ifReverse = (req.query.reverse == "no") ? 1 : -1;
    try {
        let data = await ToyModel.find({ $or: [{ name: qRegExp }, { info: qRegExp }]})
            .sort({ [sortQ]: ifReverse })
            .limit(perPage)
            .skip(page * perPage)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.post("/", authToken, async (req, res) => {
    let validBody = validTOY(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let toy = new ToyModel(req.body);
        toy.user_id = req.userData._id;
        await toy.save();
        res.status(201).json(toy);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.put("/:editId", authToken, async (req, res) => {
    let editId = req.params.editId;
    let validBody = validTOY(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let toy = await ToyModel.updateOne({ _id: editId, user_id: req.userData._id }, req.body);
        res.json(toy);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.delete("/:delId", authToken, async (req, res) => {
    let delId = req.params.delId;
    try {
        let toy = await ToyModel.deleteOne({ _id: delId, user_id: req.userData._id });
        res.json(toy);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;