const express = require("express");
const router = new express.Router();
const sparePartFaultModel = require("../models/sparePartFault");
 

router.post("/addFault",async (req, res) => {
    let body = req.body;
    try {
        let check = await sparePartFaultModel.findOne({faultName:body.faultName});
        let bool=false;
        if (check) {
            res.json({ status: false, msg: "Fault already exists" });
        } else {
            let obj = { ...body  };
            let sparePartFault = new  sparePartFaultModel(obj);
            let newsparePartFault = await sparePartFault.save();
            res.json({
                status: true,
                msg: "Fault add successfully"
            })
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

 
router.get("/getAllFault",async (req,res)=>{
    try{
        let sparePartFault=await sparePartFaultModel.find({})
        res.send(sparePartFault);
    }catch(err){
        res.status(400).send(err);
    }
})

router.get("/getFaultBy/:id",async (req,res)=>{
    try{
        let _id=req.params.id;
        let sparePartFault=await sparePartFaultModel.find({userId:_id});
        res.send(sparePartFault);
    }catch(err){
        res.status(404).send("Fault Not found");
    }
})

router.patch("/updateFaultBy/:id",async (req,res)=>{
    try{
        let _id=req.params.id;
        let body=req.body;
        let sparePartFault=await sparePartFaultModel.findByIdAndUpdate(_id,body,{new:true});
        res.json({status:true,msg:"Updated Fault details"});
    }catch(err){
        res.status(500).send(err);
    }
});

 
router.delete("/deleteFaultBy/:id",async (req,res)=>{
    try{
        let _id=req.params.id;
        let sparePartFault=await sparePartFaultModel.findByIdAndDelete(_id);
        res.json({status:true,msg:"Deleted"});
    }catch(err){
        res.status(500).send(err);
    }
});

 
module.exports = router;