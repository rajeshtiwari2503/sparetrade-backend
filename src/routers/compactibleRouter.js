const express = require("express");
const router=new express.Router();
const QRCode = require("qrcode");
const { upload, generateQRCodeFromString } = require("../services/service");
const Compactible=require("../models/compactibleProduct");

router.post("/addCompactibleSparePart",upload().array("images"), async (req, res) => {
    try {
        let body = req.body;
        let files = req.files;
        let images = files?.map(f1 => f1.location);
        let obj = new Compactible({ ...body, images: images });
        let data = await obj.save();
        let id=data._id;
        QRCode.toDataURL(id.toHexString(),async function (err, code) {
            if(err) res.send(err);
            else
           await Compactible.findByIdAndUpdate(data._id,{qrcode:code}); 
        })
        res.json({ status: true, msg: "Spare part added successfully" });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch("/updateCompactibleSparePart/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let body = req.body;
        let obj = await Compactible.findByIdAndUpdate(_id, body);
        res.json({ status: true, msg: "Spare part updated successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/allCompactibleSpareParts", async (req, res) => {
    try {
        let data = await Compactible.find({});
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/getCompactibleSparePartsByName", async (req, res) => {
    try {
        let body=req.body;
        let data = await Compactible.findOne({ compactibleWith: { $in: [body.name] } });
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/compactibleSparePartByuserId/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await Compactible.find({ userId: id });
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch("/deleteCompactibleSparePartImage/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let body = req.body;
        let obj = await Compactible.findById(_id);
        let index = obj.images.findIndex(img => img === body.img);
        if (index >= 0) {
            let img = obj.images.splice(index, 1);
            let obj1 = await Compactible.findByIdAndUpdate(_id, { images: obj.images });
            res.json({ status: true, msg: "Deleted" });
        } else {
            res.status(404).json({ status: false, msg: "Not found" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


router.patch("/uploadCompactibleImage/:id", upload().single("image"), async (req, res) => {
    try {
        let _id = req.params.id;
        let obj = await Compactible.findById(_id);
        obj.images.push(req.file.location);
        let obj1 = await Compactible.findByIdAndUpdate(_id, { images: obj.images });
        res.json({ status: true, msg: "Uploaded" });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete("/deleteCompactibleSparePart/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let obj = await Compactible.findByIdAndDelete(_id);
        res.json({ status: true, msg: "Spare part deleted successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports=router;