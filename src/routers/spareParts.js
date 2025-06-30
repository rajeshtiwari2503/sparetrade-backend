const express = require("express");
const router = new express.Router();
const sparePartModel = require("../models/sparePartsModel");
const Compactible=require("../models/compactibleProduct");
const QRCode = require("qrcode");
const { upload, generateQRCodeFromString } = require("../services/service");

router.post("/addSparePart",upload().array("images"), async (req, res) => {
    try {
        let body = req.body;
        let files = req.files;
        let images = files?.map(f1 => f1.location);
        let obj = new sparePartModel({ ...body, images: images });
        let data = await obj.save();
        res.json({ status: true, msg: "Spare part added successfully" });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch("/updateSparePart/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let body = req.body;
        let obj = await sparePartModel.findByIdAndUpdate(_id, body);
        res.json({ status: true, msg: "Spare part updated successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/allSparePart", async (req, res) => {
    try {
        let search = req.query.sparePart;
            const [modelAResults, modelBResults] = await Promise.all([
              sparePartModel.find({ $or: [{ partName: {$regex :new RegExp(search,'i') }},{ partNo: {$regex :new RegExp(search,'i') }}] }).exec(),
              Compactible.find({ $or: [{ partName: {$regex :new RegExp(search,'i') }},{ partNo: {$regex :new RegExp(search,'i') }}] }).exec()
            ]);
        res.send([...modelAResults,...modelBResults]);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/sparePartByCategory", async (req, res) => {
    try {
        let {category} = req.query;
        let data = await sparePartModel.find({category:category});
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/allSparePartForAdmin", async (req, res) => {
    try {
        let search = req.query.sparePart;
        let data = await sparePartModel.find({});
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/getSparePartByAdminId",async(req,res)=>{
    try{
        let body=req.body;
        let data=await sparePartModel.findOne({userId:body.id,partName:body.partName});
        res.send(data);
    }catch(err){
        res.status(400).send(err);
    }
});

router.get("/sparePart/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await sparePartModel.find({ productId: id });
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/sparePartByuserId/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await sparePartModel.find({ userId: id });
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch("/deleteSparePartImage/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let body = req.body;
        let obj = await sparePartModel.findById(_id);
        let index = obj.images.findIndex(img => img === body.img);
        if (index >= 0) {
            let img = obj.images.splice(index, 1);
            let obj1 = await sparePartModel.findByIdAndUpdate(_id, { images: obj.images });
            res.json({ status: true, msg: "Deleted" });
        } else {
            res.status(404).json({ status: false, msg: "Not found" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


router.patch("/uploadSPImage/:id", upload().single("image"), async (req, res) => {
    try {
        let _id = req.params.id;
        let obj = await sparePartModel.findById(_id);
        obj.images.push(req.file.location);
        let obj1 = await sparePartModel.findByIdAndUpdate(_id, { images: obj.images });
        res.json({ status: true, msg: "Uploaded" });
    } catch (err) {
        res.status(500).send(err);
    }
});



router.delete("/deleteSparePart/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let obj = await sparePartModel.findByIdAndDelete(_id);
        res.json({ status: true, msg: "Spare part deleted successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/qrcode", async (req, res) => {
    let body=req.body;
    QRCode.toDataURL(body.msg,async function (err, code) {
        if(err) res.send(err);
        else res.send(code);
    })
})

module.exports = router;
